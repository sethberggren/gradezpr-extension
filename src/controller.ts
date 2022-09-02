import accordionController from "./controllers/accordionController";
import { blankGradesController, blankGradesInitialize } from "./controllers/blankGradesController";
import {
  fillSpeedController,
  fillSpeedInitialize,
} from "./controllers/fillSpeedController";
import { mainScreenController, mainScreenInitialize } from "./controllers/mainScreenController";
import {
  specialMarkGradesController,
  specialMarksInitialize,
} from "./controllers/specialGradeMarksController";


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
