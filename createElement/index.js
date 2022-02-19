import { useRef } from "../index"
import uuid from "butter-uuid"
const styleObjectToString = (obj) => {
  const dashedStyle = Object.keys(obj).reduce((acc, current, index) => {
    const dashed = current.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    return acc += `${dashed}:${obj[current]};`
  }, "")
  return dashedStyle
}

class ReactElement {
  constructor(tag, props, children) {
    if (props.style && typeof props.style !== "string") {
      props.style = styleObjectToString(props.style)
    }
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
}

const createElement = (tag, props, ...children) => {
  const key = useRef(uuid())
  if (!props) props = {}
  props.innerText = children.reduce((acc, a, index) => {
    if (typeof a === "string" || typeof a === "number") return acc += `${(a).toString()}${index !== children.length - 1 ? "," : ""}`
  }, "") || "";
  if (props.innerText !== '') children = []
  props.children = children || [];
  if (typeof tag != "string") {
    const elm = tag(props)
    return elm;
  }
  props.key = props.key || key.current

  return new ReactElement(tag, props, children);
};
export default createElement;
