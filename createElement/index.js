import { useRef } from "../index";
import { hashedCode } from "butter-uuid";
import { cammelToDash } from "../utilities";

const styleObjectToString = (obj) => {
  const dashedStyle = Object.keys(obj).reduce((acc, current, index) => {
    const dashed = cammelToDash(current);
    return (acc += `${dashed}:${obj[current]};`);
  }, "");
  return dashedStyle;
};

export class ReactElement {
  constructor(tag, props) {
    if (props.style && typeof props.style !== "string") {
      props.style = styleObjectToString(props.style);
    }
    this.tag = tag;
    this.props = props;
  }
}

const createElement = (tag, props, ...children) => {
  if (!props) props = {};
  const key = useRef(
    props.key ||
      hashedCode(`${JSON.stringify(children)}${tag}${JSON.stringify(props)}`)
  );
  props.children =
    props.children ||
    children.reduce((acc, child) => {
      if (Array.isArray(child))
        child.forEach((elm) => {
          acc.push(elm);
        });
      else {
        acc.push(child);
      }
      return acc;
    }, []);
  props.key = props.key || key.current;
  props["butter-key"] = props.key;
  if (tag instanceof Function) {
    const reactElm = tag(props);
    return reactElm;
  }

  return new ReactElement(tag, props, props.children);
};
export default createElement;
