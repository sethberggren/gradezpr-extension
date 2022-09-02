import { fillSpeedInput } from "../elements";
import useReducer from "../useReducer";

// state management

const [getFillSpeed, dispatchFillSpeed] = useReducer(
  "fillSpeed",
  fillSpeedReducer,
  { fillSpeed: 500 }
);

// controller and initialization

export function fillSpeedController() {
  fillSpeedInput.onchange = fillSpeedInputChangeHandler;
}

export async function fillSpeedInitialize() {
  const fillSpeedForm = await getFillSpeed();
  fillSpeedInput.value = fillSpeedForm.fillSpeed.toString();
}

// change handlers

function fillSpeedInputChangeHandler() {
  dispatchFillSpeed({
    type: "update",
    payload: parseFloat(fillSpeedInput.value),
  });
}

// reducer
function fillSpeedReducer(
  fillSpeedForm: FillSpeedForm,
  action: FillSpeedActions
) {
  switch (action.type) {
    case "update": {
      return { fillSpeed: action.payload };
    }
  }
}
