import domRenderer from "./domRenderer/index";
import createElement from "./createElement/index";
const applets = [];
const store = [];
const contextStore = [];
var ctxIndx = 0;
var idx = 0;
export const useState = (initVal) => {
  if (initVal instanceof Function && store[idx] == null) store[idx] = initVal();
  var state = store[idx] == null ? initVal : store[idx];
  const _idx = idx;
  const setState = (newVal) => {
    if (newVal instanceof Function) newVal = newVal(store[_idx]);
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
    hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
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
    return { children };
  };
  ctxIndx++;
  return { index: _idx, Provider };
};

export const useContext = ({ index }) => {
  return contextStore[index];
};

export const renderDom = (cmpt, elm) => {
  applets.push({ cmpt, elm, vdom: {} });
};

export const StaticComponent = (Component, uuid) => {
  return (props) => {
    const reactElement = Component(props);
    reactElement.props["static-component"] = uuid;
    return reactElement;
  };
};

export const getServerData = async (...args) => {
  if (!window) {
    const response = serverFetch(...args);
    return response;
  } else {
    return fetch(...args);
  }
};

setInterval(() => {
  idx = 0;
  applets.forEach((_, i) => {
    domRenderer(applets[i]);
  });
}, 50);
applets.forEach((_, i) => {
  domRenderer(applets[i]);
});

const React = {
  useState,
  useRef,
  useReducer,
  createContext,
  useContext,
  renderDom,
  createElement,
};

export default React;
