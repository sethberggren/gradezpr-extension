import accordionController from "./accordionController";
import {
  blankGradesController,
  blankGradesInitialize,
} from "./blankGradesController";
import {
  fillSpeedController,
  fillSpeedInitialize,
} from "./fillSpeedController";
import { mainScreenController, mainScreenInitialize } from "./mainScreenController";
import {
  specialMarkGradesController,
  specialMarksInitialize,
} from "./specialGradeMarksController";


// initialize everything when the popup comes up
document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await mainScreenInitialize();
    await blankGradesInitialize();
    await specialMarksInitialize();
    await fillSpeedInitialize();
  },
  false
);


// add event listeners for components
mainScreenController();
accordionController();
blankGradesController();
specialMarkGradesController();
fillSpeedController();
