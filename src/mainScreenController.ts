import {
  copyGradesAction,
  repeatGetStudents,
  clearGradesAction,
} from "./background";
import {
  copyGrades,
  pasteGrades,
  clearGrades,
  advancedSettings,
  advancedSettingsBack,
  mainScreen,
  advancedSettingsPanel,
} from "./elements";
import { hide, show } from "./visibility";

// global variables and functions:
const copyGradesDefault = "Copy Grades";

const copyGradesNumText = (parsedGrades: ParsedGrades[]) => {
  return `${parsedGrades.length} grades copied`;
};

export function mainScreenController() {
  copyGrades.onclick = copyGradesClickHandler;

  pasteGrades.onclick = pasteGradesClickHandler;

  clearGrades.onclick = clearGradesClickHandler;

  advancedSettings.onclick = advancedSettingsClickHandler;

  advancedSettingsBack.onclick = advancedSettingsBackClickHandler;
}

export async function mainScreenInitialize() {

  // see how many parsed grades there are, and update the copy grades button accordingly
  const { parsedGrades } = (await chrome.storage.local.get([
    "parsedGrades",
  ])) as ParsedGradesStorage;

  if (parsedGrades) {
    copyGrades.innerText =
      parsedGrades.length === 0
        ? copyGradesDefault
        : copyGradesNumText(parsedGrades);
  }
}

// button click handlers

async function copyGradesClickHandler() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: copyGradesAction,
  });

  const { parsedGrades } = (await chrome.storage.local.get([
    "parsedGrades",
  ])) as ParsedGradesStorage;

  copyGrades.innerText = copyGradesNumText(parsedGrades);
}

async function pasteGradesClickHandler() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: repeatGetStudents,
  });
}

async function clearGradesClickHandler() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: clearGradesAction,
  });

  copyGrades.innerText = copyGradesDefault;
}

function advancedSettingsClickHandler() {
  hide(mainScreen);
  show(advancedSettingsPanel);
  document.body.classList.add("wide");
}

function advancedSettingsBackClickHandler() {
  hide(advancedSettingsPanel);
  show(mainScreen);
  document.body.classList.remove("wide");
}
