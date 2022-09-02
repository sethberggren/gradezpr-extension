export default function copyGradesFromClipboard() {
  try {
    // have to create text area to copy and paste from clipboard (navigator.clipboard doesn't work with chrome extensions for some reason...)
    const textArea = document.createElement("textarea");
    document.body.append(textArea);

    textArea.select();
    document.execCommand("paste");

    const gradeString = textArea.value;

    textArea.remove();

    const parsedGrades = splitGradeString(gradeString);

    chrome.storage.local.set({ parsedGrades: parsedGrades }, () =>
      alert(`Copied ${parsedGrades.length} grades.`)
    );
  } catch (e) {
    console.log(e);
  }

  // function to parse grades with one grade per line from grade updater and convert to JS object
  function splitGradeString(str: string): { name: string; grade: number }[] {
    const grades = str.split(/\r?\n/);
    const gradeRegex = /([0-9]+\.?[0-9]*|\.[0-9]+)/;

    const parsedGrades: { name: string; grade: number }[] = [];

    for (const grade of grades) {
      if (grade === "") {
        continue;
      }

      const match = grade.search(gradeRegex);
      const name = grade.slice(0, match).trim();
      const gradeNum = parseFloat(grade.slice(match));

      parsedGrades.push({ name: name, grade: gradeNum });
    }

    return parsedGrades;
  }
}
