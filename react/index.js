import domRenderer from "./domRenderer/index.js";
import createElement from "./createElement/index.js";
const applets = []
const store = [];
const contextStore = [];
var ctxIndx = 0;
var idx = 0;
export const useState = (initVal) => {
  const state = store[idx] || initVal;
  const _idx = idx;
  const setState = (newVal) => {
    if (typeof newVal === "function") newVal = newVal(store[_idx]);
    store[_idx] = newVal;
  };
  store[idx] = state;
  idx++;
  return [state, setState];
};

export const useRef = (initValue) => {
  const state = useState({ current: initValue })[0];
  return state;
};

export const useEffect = (cb, depArray) => {
  const oldDeps = store[idx];
  let hasChanged = true;
  if (oldDeps) {
    hasChanged = depArray.some((dep, i) => Object.is(dep, oldDeps[i]));
  }
  if (hasChanged) cb();
  store[idx] = depArray;
  idx++;
};

export const useReducer = (reducer, initVal) => {
  const [state, setState] = useState(initVal);
  const dispatch = (action) => {
    return setState(reducer(action));
  };
  return [state, dispatch];
};

export const createContext = (initVal) => {
  contextStore[idx] = initVal;
  const _idx = ctxIndx;
  const Provider = ({ value, children }) => {
    contextStore[_idx] = value;
    return { children }
  };
  ctxIndx++;
  return { index: _idx, Provider };
};

export const useContext = ({ index }) => {
  return contextStore[index];
};

export const useMemo = (func) => {
  return (...values) => {
    const [state, setState] = useState(func(...values))
    useEffect(() => {
      console.log("actually ran")
      setState(func(...values))
    }, values)
    return state
  }
}
export const renderDom = (cmpt, elm) => {
  applets.push({ cmpt, elm, vdom: {} })
};

setInterval(() => {
  idx = 0;
  applets.forEach((_, i) => {
    domRenderer(applets[i])
  })
}, 50);

const React = {
  useState,
  useRef,
  useReducer,
  createContext,
  useContext,
  renderDom,
  createElement
}

export default React

