import clearGradesAction from "../actions/clearGrades";
import copyGradesFromClipboard from "../actions/copyGradesFromClipboard";
import copyGradesFromWebsite from "../actions/copyGradesFromWebsite";
import pasteGradesAction from "../actions/pasteGrades";
import {
  copyGrades,
  pasteGrades,
  clearGrades,
  advancedSettings,
  advancedSettingsBack,
  mainScreen,
  advancedSettingsPanel,
  copyGradesFromWebsite as copyGradesFromWebsiteBtn,
  copiedGradesDescription,
} from "../elements";
import { hide, show } from "../visibility";
import {
  gradeCurveController,
  gradeCurveInitialize,
} from "./gradeCurveController";

// global variables and functions:
const copyGradesDefault = "There are no copied grades.";

const copyGradesNumText = (parsedGrades: ParsedGrades[]) => {
  return `${parsedGrades.length} grades copied.`;
};

export function mainScreenController() {
  copyGrades.onclick = copyGradesClickHandler;

  copyGradesFromWebsiteBtn.onclick = copyGradesFromWebsiteClickHandler;

  pasteGrades.onclick = pasteGradesClickHandler;

  clearGrades.onclick = clearGradesClickHandler;

  advancedSettings.onclick = advancedSettingsClickHandler;

  advancedSettingsBack.onclick = advancedSettingsBackClickHandler;

  gradeCurveController();
}

export async function mainScreenInitialize() {
  // see how many parsed grades there are, and update the copy grades button accordingly
  const { parsedGrades } = (await chrome.storage.local.get([
    "parsedGrades",
  ])) as ParsedGradesStorage;

  gradeCurveInitialize();

  if (parsedGrades) {
    copiedGradesDescription.innerText =
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
    func: copyGradesFromClipboard,
  });

  const { parsedGrades } = (await chrome.storage.local.get([
    "parsedGrades",
  ])) as ParsedGradesStorage;

  copiedGradesDescription.innerText = copyGradesNumText(parsedGrades);
}

async function copyGradesFromWebsiteClickHandler() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: copyGradesFromWebsite,
  });
}

async function pasteGradesClickHandler() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: pasteGradesAction,
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

  copiedGradesDescription.innerText = copyGradesDefault;
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
