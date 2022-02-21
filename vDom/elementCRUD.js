import { cammelToDash } from "../utilities";

export const setProps = (elm, props) => {
  const existing = document.querySelector(`[butter-key="${props.key}"]`);
  props["butter-key"] = props.key;
  if (existing) elm = existing;
  props &&
    !!Object.keys(props).length &&
    Object.keys(props).forEach((propName) => {
      if (propName.indexOf("data") === 0) {
        const propname = cammelToDash(propName);
        props[propname] = props[propName];
        propName = propname;
      }
      if (propName.indexOf("on") === 0) {
        const propname = propName.toLowerCase();
        props[propname] = props[propName];
        propName = propname;
      }
      if (propName !== "children") {
        if (
          Object.is(elm[propName], undefined) &&
          props[propName] instanceof Function === false &&
          propName !== "key"
        )
          elm.setAttribute(propName, props[propName]);
        elm[propName] = props[propName];
      }
    });
};

export const create = (tag, props) => {
  const elm = document.createElement(tag);
  setProps(elm, props);
  return elm;
};

export const read = (reactElement) => {
  return reactElement.elm;
};

export const update = (elm, props) => {
  setProps(elm, props);
};

export const remove = (elm) => {
  elm.remove();
};

const defaultExport = { create, read, update, remove };
export default defaultExport;
