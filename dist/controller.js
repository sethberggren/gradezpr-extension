/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ 100: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      function clearGradesAction() {
        chrome.storage.local.set({ parsedGrades: [] }, () =>
          alert("Cleared grades!")
        );
      }
      exports["default"] = clearGradesAction;

      /***/
    },

    /***/ 205: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      function copyGradesFromClipboard() {
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
        function splitGradeString(str) {
          const grades = str.split(/\r?\n/);
          const gradeRegex = /([0-9]+\.?[0-9]*|\.[0-9]+)/;
          const parsedGrades = [];
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
      exports["default"] = copyGradesFromClipboard;

      /***/
    },

    /***/ 29: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      function copyGradesFromWebsite() {
        const supportedWebsitesUrl = ["classroom.google.com"];
        const supportedWebsitesName = ["Google Classroom"];
        const supportedWebsitesBlurb = `Sorry, this website isn't currently supported by Gradezpr's grade copying function.  Supported websites include: ${supportedWebsitesName.join(
          ", "
        )}.`;
        if (
          !supportedWebsitesUrl.some((url) =>
            window.location.href.includes(url)
          )
        ) {
          alert(supportedWebsitesBlurb);
          return;
        }
        const allTables = document.querySelectorAll("table");
        let allStudentsContainer = null;
        for (const table of allTables) {
          if (table.hasAttribute("role")) {
            allStudentsContainer = table;
            break;
          }
        }
        if (allStudentsContainer === null) {
          alert(supportedWebsitesBlurb);
          return;
        }
        // get all the tr inside the student container that have the "data-student-id property"
        const studentContainerRows =
          allStudentsContainer.querySelectorAll("tr");
        const studentRows = [];
        for (const studentContainerRow of studentContainerRows) {
          if (studentContainerRow.hasAttribute("data-student-id")) {
            studentRows.push(studentContainerRow);
          }
        }
        // now, parse all the student data
        const nameRegex = /(?<=\t\n)(.*?)(?=\n\t)/;
        const totalPointsRegex = /(?<=out of)(.*?)(?=\n)/;
        const earnedPointsRegex = /(?<=\n)(.*?)(?=out of)/;
        const parsedGrades = [];
        for (const studentRow of studentRows) {
          const studentNameMatch = nameRegex.exec(studentRow.innerText);
          const totalPointsMatch = totalPointsRegex.exec(studentRow.innerText);
          const earnedPointsMatch = earnedPointsRegex.exec(
            studentRow.innerText
          );
          if (studentNameMatch && totalPointsMatch && earnedPointsMatch) {
            const studentName = studentNameMatch[0].trim();
            const totalPoints = parseFloat(totalPointsMatch[0].trim());
            const earnedPoints = parseFloat(earnedPointsMatch[0].trim());
            const rawGrade = (earnedPoints / totalPoints) * 100;
            parsedGrades.push({ name: studentName, grade: rawGrade });
          }
        }
        chrome.storage.local.set({ parsedGrades: parsedGrades }, () =>
          alert(`Copied ${parsedGrades.length} grades.`)
        );
      }
      exports["default"] = copyGradesFromWebsite;

      /***/
    },

    /***/ 301: /***/ function (__unused_webpack_module, exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      function pasteGradesAction() {
        var __awaiter =
          (this && this.__awaiter) ||
          function (thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                  });
            }
            return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }
              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }
              function step(result) {
                result.done
                  ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected);
              }
              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };

        return __awaiter(this, void 0, void 0, function* () {
          // special buttons from the keypad in Powerschool.
          const specialButtons = {
            Missing: document.getElementById("keypad-flag-missing-button"),
            Collected: document.getElementById("keypad-flag-collected-button"),
            Late: document.getElementById("keypad-flag-late-button"),
            Incomplete: document.getElementById(
              "keypad-flag-incomplete-button"
            ),
            Exempt: document.getElementById("keypad-flag-exempt-button"),
            Absent: document.getElementById("keypad-flag-absent-button"),
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
          const blankGrades = (yield chrome.storage.local.get(
            "blankGradesForm"
          )).blankGradesForm;
          const specialMarks = (yield chrome.storage.local.get("specialMarks"))
            .specialMarks;
          const fillSpeed = (yield chrome.storage.local.get("fillSpeed"))
            .fillSpeed.fillSpeed;
          const gradeCurve = (yield chrome.storage.local.get("gradeCurveForm"))
            .gradeCurveForm;
          // initialize global variables to let the program to know when to stop filling grades.
          let currentStudent = "";
          let end = false;
          const { parsedGrades } = yield chrome.storage.local.get([
            "parsedGrades",
          ]);
          const maxGrade = Math.max(
            ...parsedGrades.map((grade) => grade.grade)
          );
          const minGrade = Math.min(
            ...parsedGrades.map((grade) => grade.grade)
          );
          const curveGrades = (grade) => {
            const { curveGradesCheckbox, minGradeCurve, maxGradeCurve } =
              gradeCurve;
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
            yield getStudents();
          }
          // Main function that gets a student and copies the grade into the grade box on PowerSchool.
          function getStudents() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
              const possibleStudent =
                (_a = document.body.querySelector(
                  "#score-inspector-row-name"
                )) === null || _a === void 0
                  ? void 0
                  : _a.children[0].innerHTML;
              if (possibleStudent) {
                if (possibleStudent === currentStudent) {
                  end = true;
                  return;
                }
                currentStudent = possibleStudent;
                // check to see if the current student has a match in the parsed grades.
                const match = parsedGrades.find(
                  (student) =>
                    student.name === reverseStudentName(currentStudent).trim()
                );
                // if no match, use user settings for filling blank grades.
                if (!match) {
                  if (blankGrades.blankGradesFill) {
                    numToButtonPress(
                      blankGrades.blankGradesFill,
                      keypadButtons
                    );
                    if (blankGrades.markAsMissingCheckbox) {
                      specialButtons.Missing.click();
                    }
                  }
                  yield clickMoveDown();
                  return;
                }
                const keypad = document.body.querySelector(
                  "#keypad-score-input"
                );
                if (!keypad) {
                  console.log("No keypad!");
                  return;
                }
                keypad.click();
                const curvedGrade = curveGrades(match.grade);
                numToButtonPress(curvedGrade, keypadButtons);
                handleSpecialMarks(curvedGrade);
                yield clickMoveDown();
              } else {
                console.log(
                  "Whoops, this is no longer an ID that works!  Unable to get students."
                );
              }
            });
          }
          // PS gives names as Last, First but grades are copied as First Last.  Function converts Last, First to First Last format.
          function reverseStudentName(str) {
            return str.split(",").reverse().join(" ");
          }
          function clickMoveDown() {
            return __awaiter(this, void 0, void 0, function* () {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: 40 })
              );
              document.dispatchEvent(
                new KeyboardEvent("keyup", { keyCode: 40 })
              );
              // pauser must be there to give the system appropriate time to "catch up"
              yield pauser(fillSpeed);
            });
          }
          function handleSpecialMarks(grade) {
            const isSpecialGrade = specialMarks.find(
              (val) => val.grade === grade
            );
            if (isSpecialGrade) {
              specialButtons[isSpecialGrade.specialMarkOption].click();
              return;
            } else {
              return;
            }
          }
          // function to pause execution for a set number of time, combined with async await.
          function pauser(ms) {
            return __awaiter(this, void 0, void 0, function* () {
              return new Promise((resolve) => setTimeout(() => resolve(), ms));
            });
          }
          // gets numberic keypad buttons from PS
          function getKeypadButtons() {
            const keypadButtons = {};
            for (let i = 0; i < 10; i++) {
              const digitButton = document.getElementById(
                `keypad-score-${i}-button`
              );
              if (!digitButton) {
                console.log("can't find the digit button...weird");
                continue;
              }
              keypadButtons[`${i}`] = digitButton;
            }
            keypadButtons[`.`] = document.getElementById(
              "keypad-score-decimal-button"
            );
            return keypadButtons;
          }
          // converts numbers to keypad button presses to enter grade
          function numToButtonPress(num, keypadButtons) {
            const numAsStr = num.toString();
            for (const s of numAsStr) {
              keypadButtons[s].click();
            }
          }
        });
      }
      exports["default"] = pasteGradesAction;

      /***/
    },

    /***/ 120: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      const accordionController_1 = __importDefault(__webpack_require__(702));
      const blankGradesController_1 = __webpack_require__(746);
      const fillSpeedController_1 = __webpack_require__(543);
      const mainScreenController_1 = __webpack_require__(524);
      const specialGradeMarksController_1 = __webpack_require__(75);
      // initialize everything when the popup comes up
      document.addEventListener(
        "DOMContentLoaded",
        () =>
          __awaiter(void 0, void 0, void 0, function* () {
            yield (0, mainScreenController_1.mainScreenInitialize)();
            yield (0, blankGradesController_1.blankGradesInitialize)();
            yield (0, specialGradeMarksController_1.specialMarksInitialize)();
            yield (0, fillSpeedController_1.fillSpeedInitialize)();
          }),
        false
      );
      // add event listeners for components
      (0, mainScreenController_1.mainScreenController)();
      (0, accordionController_1.default)();
      (0, blankGradesController_1.blankGradesController)();
      (0, specialGradeMarksController_1.specialMarkGradesController)();
      (0, fillSpeedController_1.fillSpeedController)();

      /***/
    },

    /***/ 702: /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const elements_1 = __webpack_require__(228);
      const visibility_1 = __webpack_require__(45);
      function accordionController() {
        elements_1.accordions.forEach((accordion) => {
          accordion.controller.onclick = () => accordionOnClick(accordion);
        });
      }
      exports["default"] = accordionController;
      function accordionOnClick(accordion) {
        const accordionImg = accordion.controller.querySelector("img");
        if (accordion.expanded) {
          accordionImg.src = "./arrowDown.svg";
          (0, visibility_1.hide)(accordion.content);
          addBottomBorder(accordion.controller);
          removeBottomBorder(accordion.container);
          accordion.expanded = false;
        } else {
          accordionImg.src = "./arrowUp.svg";
          addBottomBorder(accordion.container);
          removeBottomBorder(accordion.controller);
          (0, visibility_1.show)(accordion.content);
          accordion.expanded = true;
        }
      }
      function addBottomBorder(el) {
        el.classList.add("bottom-border");
      }
      function removeBottomBorder(el) {
        el.classList.remove("bottom-border");
      }

      /***/
    },

    /***/ 746: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      // global variables and state management
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.blankGradesInitialize = exports.blankGradesController = void 0;
      const elements_1 = __webpack_require__(228);
      const useReducer_1 = __importDefault(__webpack_require__(600));
      const { blankGradesFillInput, markAsMissingCheckbox } =
        elements_1.blankGradesForm;
      const [getBlankGradesState, blankGradesDispatch] = (0,
      useReducer_1.default)("blankGradesForm", blankGradesReducer, {
        blankGradesFill: undefined,
        markAsMissingCheckbox: false,
      });
      // controller and initialization
      function blankGradesController() {
        blankGradesFillInput.onchange = blankGradesFillInputChangeHandler;
        markAsMissingCheckbox.onchange = markAsMissingCheckboxChangeHandler;
      }
      exports.blankGradesController = blankGradesController;
      function blankGradesInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
          const state = yield getBlankGradesState();
          blankGradesFillInput.value = `${state.blankGradesFill}`;
          markAsMissingCheckbox.checked = state.markAsMissingCheckbox;
        });
      }
      exports.blankGradesInitialize = blankGradesInitialize;
      // change handlers
      function blankGradesFillInputChangeHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const value = parseFloat(blankGradesFillInput.value);
          yield blankGradesDispatch({
            type: "blankGradesFill",
            payload: value,
          });
        });
      }
      function markAsMissingCheckboxChangeHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const checked = markAsMissingCheckbox.checked;
          yield blankGradesDispatch({
            type: "markAsMissingCheckbox",
            payload: checked,
          });
        });
      }
      // reducers
      function blankGradesReducer(prev, action) {
        const { blankGradesFill, markAsMissingCheckbox } = prev;
        console.log(action);
        switch (action.type) {
          case "blankGradesFill": {
            return {
              blankGradesFill: action.payload,
              markAsMissingCheckbox: markAsMissingCheckbox,
            };
          }
          case "markAsMissingCheckbox": {
            return {
              blankGradesFill: blankGradesFill,
              markAsMissingCheckbox: action.payload,
            };
          }
          default: {
            throw new Error(
              "Error, fallthrough case in switch.  Not supposed to happen."
            );
          }
        }
      }

      /***/
    },

    /***/ 543: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fillSpeedInitialize = exports.fillSpeedController = void 0;
      const elements_1 = __webpack_require__(228);
      const useReducer_1 = __importDefault(__webpack_require__(600));
      // state management
      const [getFillSpeed, dispatchFillSpeed] = (0, useReducer_1.default)(
        "fillSpeed",
        fillSpeedReducer,
        { fillSpeed: 500 }
      );
      // controller and initialization
      function fillSpeedController() {
        elements_1.fillSpeedInput.onchange = fillSpeedInputChangeHandler;
      }
      exports.fillSpeedController = fillSpeedController;
      function fillSpeedInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
          const fillSpeedForm = yield getFillSpeed();
          elements_1.fillSpeedInput.value = fillSpeedForm.fillSpeed.toString();
        });
      }
      exports.fillSpeedInitialize = fillSpeedInitialize;
      // change handlers
      function fillSpeedInputChangeHandler() {
        dispatchFillSpeed({
          type: "update",
          payload: parseFloat(elements_1.fillSpeedInput.value),
        });
      }
      // reducer
      function fillSpeedReducer(fillSpeedForm, action) {
        switch (action.type) {
          case "update": {
            return { fillSpeed: action.payload };
          }
        }
      }

      /***/
    },

    /***/ 294: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.gradeCurveInitialize = exports.gradeCurveController = void 0;
      const useReducer_1 = __importDefault(__webpack_require__(600));
      const elements_1 = __webpack_require__(228);
      const { curveGradesCheckbox, maxGradeCurve, minGradeCurve } =
        elements_1.gradeCurveForm;
      const [getGradeCurveState, gradeCurveDispatch] = (0,
      useReducer_1.default)("gradeCurveForm", gradeCurveReducer, {
        curveGradesCheckbox: false,
        minGradeCurve: undefined,
        maxGradeCurve: undefined,
      });
      // controller and initialization
      function gradeCurveController() {
        curveGradesCheckbox.onchange = handleCurveGradesCheckbox;
        minGradeCurve.onchange = handleMinGrade;
        maxGradeCurve.onchange = handleMaxGrade;
      }
      exports.gradeCurveController = gradeCurveController;
      function gradeCurveInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
          const state = yield getGradeCurveState();
          curveGradesCheckbox.checked = state.curveGradesCheckbox;
          minGradeCurve.value = `${state.minGradeCurve}`;
          maxGradeCurve.value = `${state.maxGradeCurve}`;
        });
      }
      exports.gradeCurveInitialize = gradeCurveInitialize;
      // change handlers
      function handleCurveGradesCheckbox() {
        return __awaiter(this, void 0, void 0, function* () {
          const checked = curveGradesCheckbox.checked;
          yield gradeCurveDispatch({
            type: "setCurveGradesCheckbox",
            payload: checked,
          });
        });
      }
      function handleMinGrade() {
        return __awaiter(this, void 0, void 0, function* () {
          const value = parseFloat(minGradeCurve.value);
          yield gradeCurveDispatch({
            type: "setMinGradeCurve",
            payload: value,
          });
        });
      }
      function handleMaxGrade() {
        return __awaiter(this, void 0, void 0, function* () {
          const value = parseFloat(maxGradeCurve.value);
          yield gradeCurveDispatch({
            type: "setMaxGradeCurve",
            payload: value,
          });
        });
      }
      // reducers
      function gradeCurveReducer(prev, action) {
        switch (action.type) {
          case "setCurveGradesCheckbox": {
            return Object.assign(Object.assign({}, prev), {
              curveGradesCheckbox: action.payload,
            });
          }
          case "setMaxGradeCurve": {
            return Object.assign(Object.assign({}, prev), {
              maxGradeCurve: action.payload,
            });
          }
          case "setMinGradeCurve": {
            return Object.assign(Object.assign({}, prev), {
              minGradeCurve: action.payload,
            });
          }
        }
      }

      /***/
    },

    /***/ 524: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.mainScreenInitialize = exports.mainScreenController = void 0;
      const clearGrades_1 = __importDefault(__webpack_require__(100));
      const copyGradesFromClipboard_1 = __importDefault(
        __webpack_require__(205)
      );
      const copyGradesFromWebsite_1 = __importDefault(__webpack_require__(29));
      const pasteGrades_1 = __importDefault(__webpack_require__(301));
      const elements_1 = __webpack_require__(228);
      const visibility_1 = __webpack_require__(45);
      const gradeCurveController_1 = __webpack_require__(294);
      // global variables and functions:
      const copyGradesDefault = "There are no copied grades.";
      const copyGradesNumText = (parsedGrades) => {
        return `${parsedGrades.length} grades copied.`;
      };
      function mainScreenController() {
        elements_1.copyGrades.onclick = copyGradesClickHandler;
        elements_1.copyGradesFromWebsite.onclick =
          copyGradesFromWebsiteClickHandler;
        elements_1.pasteGrades.onclick = pasteGradesClickHandler;
        elements_1.clearGrades.onclick = clearGradesClickHandler;
        elements_1.advancedSettings.onclick = advancedSettingsClickHandler;
        elements_1.advancedSettingsBack.onclick =
          advancedSettingsBackClickHandler;
        (0, gradeCurveController_1.gradeCurveController)();
      }
      exports.mainScreenController = mainScreenController;
      function mainScreenInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
          // see how many parsed grades there are, and update the copy grades button accordingly
          const { parsedGrades } = yield chrome.storage.local.get([
            "parsedGrades",
          ]);
          (0, gradeCurveController_1.gradeCurveInitialize)();
          if (parsedGrades) {
            elements_1.copiedGradesDescription.innerText =
              parsedGrades.length === 0
                ? copyGradesDefault
                : copyGradesNumText(parsedGrades);
          }
        });
      }
      exports.mainScreenInitialize = mainScreenInitialize;
      // button click handlers
      function copyGradesClickHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          yield chrome.scripting.executeScript({
            target: { tabId: tab.id ? tab.id : -1 },
            func: copyGradesFromClipboard_1.default,
          });
          const { parsedGrades } = yield chrome.storage.local.get([
            "parsedGrades",
          ]);
          elements_1.copiedGradesDescription.innerText =
            copyGradesNumText(parsedGrades);
        });
      }
      function copyGradesFromWebsiteClickHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          yield chrome.scripting.executeScript({
            target: { tabId: tab.id ? tab.id : -1 },
            func: copyGradesFromWebsite_1.default,
          });
        });
      }
      function pasteGradesClickHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          chrome.scripting.executeScript({
            target: { tabId: tab.id ? tab.id : -1 },
            func: pasteGrades_1.default,
          });
        });
      }
      function clearGradesClickHandler() {
        return __awaiter(this, void 0, void 0, function* () {
          const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          chrome.scripting.executeScript({
            target: { tabId: tab.id ? tab.id : -1 },
            func: clearGrades_1.default,
          });
          elements_1.copiedGradesDescription.innerText = copyGradesDefault;
        });
      }
      function advancedSettingsClickHandler() {
        (0, visibility_1.hide)(elements_1.mainScreen);
        (0, visibility_1.show)(elements_1.advancedSettingsPanel);
        document.body.classList.add("wide");
      }
      function advancedSettingsBackClickHandler() {
        (0, visibility_1.hide)(elements_1.advancedSettingsPanel);
        (0, visibility_1.show)(elements_1.mainScreen);
        document.body.classList.remove("wide");
      }

      /***/
    },

    /***/ 75: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.specialMarksInitialize = exports.specialMarkGradesController =
        void 0;
      const elements_1 = __webpack_require__(228);
      const useReducer_1 = __importDefault(__webpack_require__(600));
      const visibility_1 = __webpack_require__(45);
      // global variables and state management
      let maxIndex = 0;
      const [getSpecialMarks, specialMarksDispatch] = (0, useReducer_1.default)(
        "specialMarks",
        specialMarksReducer,
        []
      );
      const { newButton, newContainer, gradeInput, specialMark, doneButton } =
        elements_1.newSpecialMarks;
      // controller and initialization
      function specialMarkGradesController() {
        newSpecialMarksController();
      }
      exports.specialMarkGradesController = specialMarkGradesController;
      function specialMarksInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
          const specialMarks = yield getSpecialMarks();
          if (specialMarks.length === 0) {
            return;
          }
          // set the new max index for the any new special marks that are created.
          maxIndex =
            specialMarks.sort((a, z) => z.index - a.index)[0].index + 1;
          for (const specialMark of specialMarks) {
            specialMarksDisplay(specialMark);
          }
        });
      }
      exports.specialMarksInitialize = specialMarksInitialize;
      // handle the addition of new grade marks
      function newSpecialMarksController() {
        newButton.onclick = () => (0, visibility_1.show)(newContainer);
        doneButton.onclick = () => {
          const grade = parseFloat(gradeInput.value);
          if (isNaN(grade)) {
            alert("Must enter a grade!");
            return;
          }
          const newSpecialMark = {
            grade: grade,
            index: maxIndex,
            specialMarkOption: specialMark.value,
          };
          // increment the max index for the next special mark
          maxIndex++;
          specialMarksDisplay(newSpecialMark);
          specialMarksDispatch({ type: "add", payload: newSpecialMark });
          (0, visibility_1.hide)(newContainer);
        };
      }
      function specialMarksDisplay(specialMark) {
        const { grade, specialMarkOption, index } = specialMark;
        const currIndex = index;
        const toAppend = `<div
  class="marks-grid"
  id=${generateSpecialMarksId(currIndex)}>
  <div>
    <p class="special-marks-header">Grade:</p>
    <p>${grade} </p>
  </div>

  <div>
    <p class="special-marks-header">Mark:</p>
    <p>${specialMarkOption} </p>
  </div> 
  
  <div class="grid-container">
  <button id=${generateSpecialMarksButtonId(
    currIndex
  )} class="icon-button btn-ghost">
    <img src="./trash.svg" class="icon-img" />
  </button>
  </div>
  </div>`;
        elements_1.specialMarksContainer.insertAdjacentHTML(
          "beforeend",
          toAppend
        );
        const deleteButton = document.getElementById(
          generateSpecialMarksButtonId(currIndex)
        );
        // attach event handler so the delete button deletes corresponding rule
        deleteButton.onclick = () => {
          const specialMarksToRemove = document.getElementById(
            generateSpecialMarksId(currIndex)
          );
          specialMarksToRemove === null || specialMarksToRemove === void 0
            ? void 0
            : specialMarksToRemove.remove();
          specialMarksDispatch({ type: "remove", payload: currIndex });
        };
      }
      function generateSpecialMarksId(index) {
        return `specialMarks-${index}`;
      }
      function generateSpecialMarksButtonId(index) {
        return `specialMarksBtn-${index}`;
      }
      // reducer
      function specialMarksReducer(specialMarks, action) {
        console.log(specialMarks);
        switch (action.type) {
          case "add": {
            return [...specialMarks, action.payload];
          }
          case "remove": {
            const indexToRemove = specialMarks.findIndex(
              (val) => val.index === action.payload
            );
            if (indexToRemove === -1) {
              console.log("No special marks found to remove!");
              return [...specialMarks];
            }
            specialMarks.splice(indexToRemove, 1);
            console.log("here's the removed special marks");
            console.log(specialMarks);
            return [...specialMarks];
          }
          case "update": {
            const { index, update } = action.payload;
            specialMarks.splice(index, 1, update);
            return [...specialMarks];
          }
        }
      }

      /***/
    },

    /***/ 228: /***/ (__unused_webpack_module, exports) => {
      // this file contains all the elements in the popup
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fillSpeedInput =
        exports.newSpecialMarks =
        exports.specialMarksContainer =
        exports.blankGradesForm =
        exports.accordions =
        exports.gradeCurveForm =
        exports.mainScreen =
        exports.advancedSettingsPanel =
        exports.advancedSettingsBack =
        exports.advancedSettings =
        exports.clearGrades =
        exports.pasteGrades =
        exports.copyGradesFromWebsite =
        exports.copiedGradesDescription =
        exports.copyGrades =
          void 0;
      exports.copyGrades = document.getElementById("copyGrades");
      exports.copiedGradesDescription = document.getElementById(
        "copiedGradesDescription"
      );
      exports.copyGradesFromWebsite = document.getElementById(
        "copyGradesFromWebsite"
      );
      exports.pasteGrades = document.getElementById("pasteGrades");
      exports.clearGrades = document.getElementById("clearGrades");
      exports.advancedSettings = document.getElementById("advancedSettings");
      exports.advancedSettingsBack = document.getElementById(
        "advancedSettingsBackArrow"
      );
      exports.advancedSettingsPanel = document.getElementById(
        "advancedSettingsPanel"
      );
      exports.mainScreen = document.getElementById("mainScreen");
      const accordionTitles = [
        "blankGrades",
        "specialMarks",
        "fillSpeed",
        "gradeCurve",
      ];
      exports.gradeCurveForm = {
        curveGradesCheckbox: document.getElementById("curveGradesCheckbox"),
        minGradeCurve: document.getElementById("minGradeCurve"),
        maxGradeCurve: document.getElementById("maxGradeCurve"),
      };
      exports.accordions = accordionTitles.map((title) => {
        return {
          container: document.getElementById(`${title}AccordionContainer`),
          controller: document.getElementById(`${title}AccordionController`),
          content: document.getElementById(`${title}AccordionContent`),
          expanded: false,
        };
      });
      exports.blankGradesForm = {
        blankGradesFillInput: document.getElementById("blankGradesFillInput"),
        markAsMissingCheckbox: document.getElementById("markAsMissingCheckbox"),
      };
      exports.specialMarksContainer = document.getElementById(
        "specialMarksContainer"
      );
      exports.newSpecialMarks = {
        newButton: document.getElementById("newSpecialMarksButton"),
        newContainer: document.getElementById("newSpecialMarksContainer"),
        gradeInput: document.getElementById("specialMarksGradeInput"),
        specialMark: document.getElementById("specialMarksSelect"),
        doneButton: document.getElementById("specialMarksDoneButton"),
      };
      exports.fillSpeedInput = document.getElementById("fillSpeedInput");

      /***/
    },

    /***/ 600: /***/ function (__unused_webpack_module, exports) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      function getState(key, defaultVal) {
        return __awaiter(this, void 0, void 0, function* () {
          const maybeState = yield chrome.storage.local.get(key);
          if (maybeState[key]) {
            return maybeState[key];
          } else {
            // state has not been intialized, initalize with default state
            // this should only happen once when the app is installed, or if the user clears their local storage.
            yield setState(key, defaultVal);
            return defaultVal;
          }
        });
      }
      function setState(key, newState) {
        return __awaiter(this, void 0, void 0, function* () {
          yield chrome.storage.local.set({ [key]: newState });
          return;
        });
      }
      function useReducer(key, reducer, defaultVal) {
        const state = () =>
          __awaiter(this, void 0, void 0, function* () {
            return yield getState(key, defaultVal);
          });
        const dispatch = (action) =>
          __awaiter(this, void 0, void 0, function* () {
            const state = yield getState(key, defaultVal);
            const newState = reducer(state, action);
            yield setState(key, newState);
            return;
          });
        return [state, dispatch];
      }
      exports["default"] = useReducer;

      /***/
    },

    /***/ 45: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hide = exports.show = void 0;
      const show = (el) => {
        el.classList.remove("hidden");
      };
      exports.show = show;
      const hide = (el) => {
        el.classList.add("hidden");
      };
      exports.hide = hide;

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module is referenced by other modules so it can't be inlined
  /******/ var __webpack_exports__ = __webpack_require__(120);
  /******/
  /******/
})();
