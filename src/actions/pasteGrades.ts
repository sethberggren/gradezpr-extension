export default async function pasteGradesAction(): Promise<void> {
  // special buttons from the keypad in Powerschool.
  const specialButtons: { [key in SpecialMarksOption]: HTMLButtonElement } = {
    Missing: document.getElementById(
      "keypad-flag-missing-button"
    ) as HTMLButtonElement,
    Collected: document.getElementById(
      "keypad-flag-collected-button"
    ) as HTMLButtonElement,
    Late: document.getElementById(
      "keypad-flag-late-button"
    ) as HTMLButtonElement,
    Incomplete: document.getElementById(
      "keypad-flag-incomplete-button"
    ) as HTMLButtonElement,
    Exempt: document.getElementById(
      "keypad-flag-exempt-button"
    ) as HTMLButtonElement,
    Absent: document.getElementById(
      "keypad-flag-absent-button"
    ) as HTMLButtonElement,
  };

  const keypadButtons = getKeypadButtons();

  // if any of the above buttons is missing, likely not on Powerschool!  Alert user and abort.
  if (specialButtons.Missing === null) {
    alert(
      "It looks like you haven't clicked on a grade box in Powerschool, or you're trying to copy grades to something other than Powerschool!  Please try again."
    );
    return;
  }

  // initialize the user's settings

  const blankGrades = (await chrome.storage.local.get("blankGradesForm"))
    .blankGradesForm as BlankGradesForm;
  const specialMarks = (await chrome.storage.local.get("specialMarks"))
    .specialMarks as SpecialMarks[];
  const fillSpeed = (await chrome.storage.local.get("fillSpeed")).fillSpeed
    .fillSpeed as number;
  const gradeCurve = (await chrome.storage.local.get("gradeCurveForm"))
    .gradeCurveForm as GradeCurveForm;

  // initialize global variables to let the program to know when to stop filling grades.

  let currentStudent = "";
  let end = false;

  const { parsedGrades } = (await chrome.storage.local.get([
    "parsedGrades",
  ])) as { parsedGrades: { name: string; grade: number }[] };

  const maxGrade = Math.max(...parsedGrades.map((grade) => grade.grade));
  const minGrade = Math.min(...parsedGrades.map((grade) => grade.grade));

  const curveGrades = (grade: number) => {
    const { curveGradesCheckbox, minGradeCurve, maxGradeCurve } = gradeCurve;

    if (!curveGradesCheckbox || !minGradeCurve || !maxGradeCurve) {
      return grade;
    } else {
      const newGrade =
        maxGradeCurve +
        ((minGradeCurve - maxGradeCurve) / (minGrade - maxGrade)) *
          (grade - maxGrade);

      return newGrade;
    }
  };

  if (parsedGrades.length === 0) {
    alert(
      "Sorry, you have no grades yet!  Click the copy grades button to copy grades from your clipboard."
    );
    return;
  }

  while (!end) {
    await getStudents();
  }

  // Main function that gets a student and copies the grade into the grade box on PowerSchool.
  async function getStudents(): Promise<void> {
    const possibleStudent = document.body.querySelector(
      "#score-inspector-row-name"
    )?.children[0].innerHTML;

    if (possibleStudent) {
      if (possibleStudent === currentStudent) {
        end = true;
        return;
      }

      currentStudent = possibleStudent;

      // check to see if the current student has a match in the parsed grades.

      const match = parsedGrades.find(
        (student) => student.name === reverseStudentName(currentStudent).trim()
      );

      // if no match, use user settings for filling blank grades.
      if (!match) {
        if (blankGrades.blankGradesFill) {
          numToButtonPress(blankGrades.blankGradesFill, keypadButtons);

          if (blankGrades.markAsMissingCheckbox) {
            specialButtons.Missing.click();
          }
        }
        await clickMoveDown();
        return;
      }

      const keypad = document.body.querySelector(
        "#keypad-score-input"
      ) as HTMLInputElement | null;

      if (!keypad) {
        console.log("No keypad!");
        return;
      }

      keypad.click();

      const curvedGrade = curveGrades(match.grade);

      numToButtonPress(curvedGrade, keypadButtons);
      handleSpecialMarks(curvedGrade);

      await clickMoveDown();
    } else {
      console.log(
        "Whoops, this is no longer an ID that works!  Unable to get students."
      );
    }
  }

  // PS gives names as Last, First but grades are copied as First Last.  Function converts Last, First to First Last format.
  function reverseStudentName(str: string): string {
    return str.split(",").reverse().join(" ");
  }

  async function clickMoveDown(): Promise<void> {
    document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 40 }));
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 40 }));

    // pauser must be there to give the system appropriate time to "catch up"
    await pauser(fillSpeed);
  }

  function handleSpecialMarks(grade: number) {
    const isSpecialGrade = specialMarks.find((val) => val.grade === grade);

    if (isSpecialGrade) {
      specialButtons[isSpecialGrade.specialMarkOption].click();
      return;
    } else {
      return;
    }
  }

  // function to pause execution for a set number of time, combined with async await.
  async function pauser(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }

  // gets numberic keypad buttons from PS
  function getKeypadButtons() {
    const keypadButtons: { [key: string]: HTMLButtonElement } = {};

    for (let i = 0; i < 10; i++) {
      const digitButton = document.getElementById(
        `keypad-score-${i}-button`
      ) as HTMLButtonElement | null;

      if (!digitButton) {
        console.log("can't find the digit button...weird");
        continue;
      }

      keypadButtons[`${i}`] = digitButton;
    }

    keypadButtons[`.`] = document.getElementById(
      "keypad-score-decimal-button"
    ) as HTMLButtonElement;

    return keypadButtons;
  }

  // converts numbers to keypad button presses to enter grade
  function numToButtonPress(
    num: number,
    keypadButtons: { [key: string]: HTMLButtonElement }
  ) {
    const numAsStr = num.toString();

    for (const s of numAsStr) {
      keypadButtons[s].click();
    }
  }
}
