import useReducer from "../useReducer";
import { gradeCurveForm } from "../elements";

const { curveGradesCheckbox, maxGradeCurve, minGradeCurve } = gradeCurveForm;
const [getGradeCurveState, gradeCurveDispatch] = useReducer(
  "gradeCurveForm",
  gradeCurveReducer,
  {
    curveGradesCheckbox: false,
    minGradeCurve: undefined,
    maxGradeCurve: undefined,
  }
);

// controller and initialization

export function gradeCurveController() {
  curveGradesCheckbox.onchange = handleCurveGradesCheckbox;

  minGradeCurve.onchange = handleMinGrade;

  maxGradeCurve.onchange = handleMaxGrade;
}

export async function gradeCurveInitialize() {
  const state = await getGradeCurveState();

  curveGradesCheckbox.checked = state.curveGradesCheckbox;
  minGradeCurve.value = `${state.minGradeCurve}`;
  maxGradeCurve.value = `${state.maxGradeCurve}`;
}

// change handlers
async function handleCurveGradesCheckbox() {
  const checked = curveGradesCheckbox.checked;

  await gradeCurveDispatch({
    type: "setCurveGradesCheckbox",
    payload: checked,
  });
}

async function handleMinGrade() {
  const value = parseFloat(minGradeCurve.value);

  await gradeCurveDispatch({ type: "setMinGradeCurve", payload: value });
}

async function handleMaxGrade() {
  const value = parseFloat(maxGradeCurve.value);

  await gradeCurveDispatch({ type: "setMaxGradeCurve", payload: value });
}

// reducers

function gradeCurveReducer(
  prev: GradeCurveForm,
  action: GradeCurveAction
): GradeCurveForm {
  switch (action.type) {
    case "setCurveGradesCheckbox": {
      return { ...prev, curveGradesCheckbox: action.payload };
    }

    case "setMaxGradeCurve": {
      return { ...prev, maxGradeCurve: action.payload };
    }

    case "setMinGradeCurve": {
      return { ...prev, minGradeCurve: action.payload };
    }
  }
}
