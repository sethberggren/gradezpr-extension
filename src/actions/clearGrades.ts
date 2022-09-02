export default function clearGradesAction() {
  chrome.storage.local.set({ parsedGrades: [] }, () =>
    alert("Cleared grades!")
  );
}
