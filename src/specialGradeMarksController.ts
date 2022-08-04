import { specialMarksContainer, newSpecialMarks } from "./elements";
import useReducer from "./useReducer";
import { hide, show } from "./visibility";

// global variables and state management

let maxIndex = 0;

const [getSpecialMarks, specialMarksDispatch] = useReducer(
  "specialMarks",
  specialMarksReducer,
  [] as SpecialMarks[]
);

const { newButton, newContainer, gradeInput, specialMark, doneButton } =
  newSpecialMarks;

// controller and initialization
export function specialMarkGradesController() {
  newSpecialMarksController();
}

export async function specialMarksInitialize() {
  const specialMarks = await getSpecialMarks();

  if (specialMarks.length === 0) {
    return;
  }

  // set the new max index for the any new special marks that are created.
  maxIndex = specialMarks.sort((a, z) => z.index - a.index)[0].index + 1;

  for (const specialMark of specialMarks) {
    specialMarksDisplay(specialMark);
  }
}

// handle the addition of new grade marks
function newSpecialMarksController() {
  newButton.onclick = () => show(newContainer);

  doneButton.onclick = () => {
    const grade = parseFloat(gradeInput.value);

    if (isNaN(grade)) {
      alert("Must enter a grade!");
      return;
    }

    const newSpecialMark: SpecialMarks = {
      grade: grade,
      index: maxIndex,
      specialMarkOption: specialMark.value as SpecialMarksOption,
    };

    // increment the max index for the next special mark
    maxIndex++;

    specialMarksDisplay(newSpecialMark);

    specialMarksDispatch({ type: "add", payload: newSpecialMark });
    hide(newContainer);
  };
}

function specialMarksDisplay(specialMark: SpecialMarks) {
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

  specialMarksContainer.insertAdjacentHTML("beforeend", toAppend);

  const deleteButton = document.getElementById(
    generateSpecialMarksButtonId(currIndex)
  ) as HTMLButtonElement;

  // attach event handler so the delete button deletes corresponding rule
  deleteButton.onclick = () => {
    const specialMarksToRemove = document.getElementById(
      generateSpecialMarksId(currIndex)
    );
    specialMarksToRemove?.remove();
    specialMarksDispatch({ type: "remove", payload: currIndex });
  };
}

function generateSpecialMarksId(index: number) {
  return `specialMarks-${index}`;
}

function generateSpecialMarksButtonId(index: number) {
  return `specialMarksBtn-${index}`;
}

// reducer

function specialMarksReducer(
  specialMarks: SpecialMarks[],
  action: SpecialMarksAction
) {
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
