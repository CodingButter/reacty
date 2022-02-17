export const setProps = (elm, props) => {
  props && !!Object.keys(props).length &&
    Object.keys(props).forEach((propName) => {
      if (propName !== "children")
        elm[propName] = props[propName]
    })
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
export default defaultExport 
