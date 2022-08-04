// this file contains all the elements in the popup

export const copyGrades = document.getElementById("copyGrades") as HTMLElement;
export const pasteGrades = document.getElementById(
  "pasteGrades"
) as HTMLElement;
export const clearGrades = document.getElementById(
  "clearGrades"
) as HTMLElement;
export const advancedSettings = document.getElementById(
  "advancedSettings"
) as HTMLElement;
export const advancedSettingsBack = document.getElementById(
  "advancedSettingsBackArrow"
) as HTMLElement;
export const advancedSettingsPanel = document.getElementById(
  "advancedSettingsPanel"
) as HTMLElement;
export const mainScreen = document.getElementById("mainScreen") as HTMLElement;

const advancedSettingsTitles = ["blankGrades", "specialMarks", "fillSpeed"];

export const advancedSettingAccordions: Accordion[] =
  advancedSettingsTitles.map((title) => {
    return {
      container: document.getElementById(
        `${title}AccordionContainer`
      ) as HTMLDivElement,
      controller: document.getElementById(
        `${title}AccordionController`
      ) as HTMLButtonElement,
      content: document.getElementById(
        `${title}AccordionContent`
      ) as HTMLElement,
      expanded: false,
    };
  });

export const blankGradesForm = {
  blankGradesFillInput: document.getElementById(
    "blankGradesFillInput"
  ) as HTMLInputElement,
  markAsMissingCheckbox: document.getElementById(
    "markAsMissingCheckbox"
  ) as HTMLInputElement,
};

export const specialMarksContainer = document.getElementById(
  "specialMarksContainer"
) as HTMLDivElement;

export const newSpecialMarks = {
  newButton: document.getElementById(
    "newSpecialMarksButton"
  ) as HTMLButtonElement,
  newContainer: document.getElementById(
    "newSpecialMarksContainer"
  ) as HTMLDivElement,
  gradeInput: document.getElementById(
    "specialMarksGradeInput"
  ) as HTMLInputElement,
  specialMark: document.getElementById(
    "specialMarksSelect"
  ) as HTMLSelectElement,
  doneButton: document.getElementById(
    "specialMarksDoneButton"
  ) as HTMLButtonElement,
};

export const fillSpeedInput = document.getElementById("fillSpeedInput") as HTMLInputElement;