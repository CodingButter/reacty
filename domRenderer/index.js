import { compare } from "../vDom/index.js";
const domRenderer = (applet) => {
  const newDom = applet.cmpt();
  compare(newDom, applet);
};

export default domRenderer;

