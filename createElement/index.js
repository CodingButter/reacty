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
  if (!props) props = {}
  props.innerText = children.reduce((acc, a) => {
    if (typeof a === "string" || typeof a === "number" || typeof a === "boolean") return acc += a.toString()
  }, "") || "";
  if (props.innerText !== '') children = []
  props.children = children || [];
  if (typeof tag != "string") {
    const elm = tag(props)
    return elm;
  }
  props.key = props.key || (typeof window !== undefined && window.btoa(JSON.stringify(props)) || Buffer.from(JSON.stringify(props)).toString('base64'))
  return new ReactElement(tag, props, children);
};
export default createElement;
