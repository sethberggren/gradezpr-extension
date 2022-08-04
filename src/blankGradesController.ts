import { blankGradesForm } from "./elements";
import useReducer from "./useReducer";

// global variables and state management

const { blankGradesFillInput, markAsMissingCheckbox } = blankGradesForm;

const [getBlankGradesState, blankGradesDispatch] = useReducer(
  "blankGradesForm",
  blankGradesReducer,
  { blankGradesFill: undefined, markAsMissingCheckbox: false }
);


// controller and initialization 

export function blankGradesController() {
  blankGradesFillInput.onchange = blankGradesFillInputChangeHandler;

  markAsMissingCheckbox.onchange = markAsMissingCheckboxChangeHandler;
}

export async function blankGradesInitialize() {
  const state = await getBlankGradesState();

  blankGradesFillInput.value = `${state.blankGradesFill}`;
  markAsMissingCheckbox.checked = state.markAsMissingCheckbox;
}

// change handlers

async function blankGradesFillInputChangeHandler() {
  const value = parseFloat(blankGradesFillInput.value);
  await blankGradesDispatch({ type: "blankGradesFill", payload: value });
}

async function markAsMissingCheckboxChangeHandler() {
  const checked = markAsMissingCheckbox.checked;

  await blankGradesDispatch({
    type: "markAsMissingCheckbox",
    payload: checked,
  });
}

// reducers

function blankGradesReducer(
  prev: BlankGradesForm,
  action: BlankGradesReducerAction
) {
  const { blankGradesFill, markAsMissingCheckbox } = prev;

  console.log(action);

  switch (action.type) {
    case "blankGradesFill": {
      return {
        blankGradesFill: action.payload,
        markAsMissingCheckbox: markAsMissingCheckbox,
      } as BlankGradesForm;
    }

    case "markAsMissingCheckbox": {
      return {
        blankGradesFill: blankGradesFill,
        markAsMissingCheckbox: action.payload,
      } as BlankGradesForm;
    }

    default: {
      throw new Error(
        "Error, fallthrough case in switch.  Not supposed to happen."
      );
    }
  }
}
