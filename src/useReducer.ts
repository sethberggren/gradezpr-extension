async function getState<K extends unknown>(key: string, defaultVal: K) {
  const maybeState = await chrome.storage.local.get(key);

  if (maybeState[key]) {
    return maybeState[key] as K;
  } else {
    // state has not been intialized, initalize with default state
    // this should only happen once when the app is installed, or if the user clears their local storage.
    await setState(key, defaultVal);
    return defaultVal;
  }
}

async function setState<K extends unknown>(key: string, newState: K) {
  await chrome.storage.local.set({ [key]: newState });
  return;
}

export default function useReducer<K extends unknown, T extends ReducerArgs>(
  key: string,
  reducer: Reducer<K, T>,
  defaultVal: K
) {

  const state = async () => {
    return await getState<K>(key, defaultVal);
  };

  const dispatch = async (action: T) => {
    const state = await getState<K>(key, defaultVal);
    const newState = reducer(state, action);
    await setState(key, newState);
    return;
  };

  return [state, dispatch] as [() => Promise<K>, (action: T) => Promise<void>];
}
