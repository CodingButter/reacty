import React from "../react/index.js"
const tags = ["a", "abbr", "acronym", "abbr", "address", "applet", "embed", "object", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "ul", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "del", "s", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
const styleContainer = document.createElement("style")
document.head.prepend(styleContainer)

const styles = {}
function uuid() {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
      return letters.map(() => letters[Math.floor(Math.random() * letters.length)]).slice(0, 15).join("")
}

const recomputeStyle = (className, computed) => {
      const newStyle = `.${className}{${computed.replace(/(\t|\r\n|\n|\r)/gm, "").replaceAll(" ", "")}}`
      if (styles[className]?.style != newStyle) {
            styles[className] = styles[className] || {}
            styles[className]?.element?.remove()
            styles[className].style = newStyle;
            styles[className].element = document.createTextNode(styles[className].style)
            styleContainer.appendChild(styles[className].element);
      }

}


const styled = (Component) => {
      if (typeof Component === "string") {
            const cmp = styled[Component]
            return styled(cmp)
      }
      return (styles, ...exprs) => {
            const className = uuid()
            return (props) => {
                  let computed = exprs.reduce((result, exp, index) => {
                        const isFunc = typeof exp === 'function'
                        const value = isFunc ? exp(props) : exp;
                        return result + value + styles[index + 1]
                  }, styles[0])
                  recomputeStyle(className, computed)
                  const renderedComponent = Component(props)
                  renderedComponent.props.className = `${className} ${renderedComponent.props.className || ""}`
                  return renderedComponent;
            }
      }
}

tags.forEach((TagName) => {
      styled[TagName] = (styles, ...exprs) => {
            const cmp = (props) => <TagName {...props}>{!!props.children.length || props.innerText}</TagName>
            return styled(cmp)(styles, ...exprs)
      }
})
export default styled