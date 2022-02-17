(() => {
  // react/vDom/elementCRUD.js
  var setProps = (elm, props) => {
    props && !!Object.keys(props).length && Object.keys(props).forEach((propName) => {
      if (propName !== "children")
        elm[propName] = props[propName];
    });
  };
  var create = (tag, props) => {
    const elm = document.createElement(tag);
    setProps(elm, props);
    return elm;
  };
  var read = (reactElement) => {
    return reactElement.elm;
  };
  var update = (elm, props) => {
    setProps(elm, props);
  };
  var remove = (elm) => {
    elm.remove();
  };
  var defaultExport = { create, read, update, remove };
  var elementCRUD_default = defaultExport;

  // react/vDom/index.js
  var objectCompare = (obj1, obj2) => {
    if (obj1 === null || obj1 === void 0 || obj2 === null || obj2 === void 0)
      return true;
    const changed = Object.keys(obj1).some((k, i) => {
      if (obj2[k] === null || obj2[k] === void 0)
        return true;
      const t1 = typeof obj1[k];
      const t2 = typeof obj2[k];
      if (t1 !== t2)
        return true;
      if (t1 === "function" && obj1[k].toString() == obj2[k].toString())
        return false;
      if (obj1[k] != obj2[k])
        return true;
    });
    return changed;
  };
  var compare = (newDom, applet) => {
    const recursiveCompare = (nElm, vElm, parent) => {
      nElm.props = nElm.props || {};
      delete nElm.props.children;
      var creates = false;
      if (!vElm || !vElm.props) {
        vElm = {};
        creates = true;
        vElm.element = nElm.tag ? elementCRUD_default.create(nElm.tag, nElm.props) : elementCRUD_default.create("div", nElm.props);
        vElm.props = nElm.props;
        vElm.children = [];
      }
      if (objectCompare(vElm.props, nElm.props)) {
        vElm.props = nElm.props;
        elementCRUD_default.update(vElm.element, nElm.props);
      }
      if (vElm.chilren) {
        const nChildrenKeys = nElm.children.map((child) => child?.props?.key);
        nChildrenKeys && vElm.children.forEach((child, index) => {
          if (nChildrenKeys.indexOf(child?.props?.key) == -1) {
            child.element.remove();
            vElm.children.splice(index, 1);
          }
        });
      }
      nElm?.children?.map((child, index) => {
        recursiveCompare(child, vElm.children[index], vElm) || [];
      });
      if (creates) {
        if (parent.element && vElm.element) {
          if (parent?.children?.push)
            parent.children.push(vElm);
          parent.element.appendChild(vElm.element);
        }
      }
      return vElm;
    };
    applet.vdom = recursiveCompare(newDom, applet.vdom, { children: [], element: applet.elm });
  };

  // react/domRenderer/index.js
  var domRenderer = (applet) => {
    const newDom = applet.cmpt();
    compare(newDom, applet);
  };
  var domRenderer_default = domRenderer;

  // react/createElement/index.js
  var styleObjectToString = (obj) => {
    const dashedStyle = Object.keys(obj).reduce((acc, current, index) => {
      const dashed = current.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      return acc += `${dashed}:${obj[current]};`;
    }, "");
    return dashedStyle;
  };
  var ReactElement = class {
    constructor(tag, props, children) {
      if (props.style && typeof props.style !== "string") {
        props.style = styleObjectToString(props.style);
      }
      this.tag = tag;
      this.props = props;
      this.children = children;
    }
  };
  var createElement = (tag, props, ...children) => {
    if (!props)
      props = {};
    props.innerText = children.reduce((acc, a) => {
      if (typeof a === "string" || typeof a === "number" || typeof a === "boolean")
        return acc += a.toString();
    }, "") || "";
    if (props.innerText !== "")
      children = [];
    props.children = children || [];
    if (typeof tag != "string") {
      const elm = tag(props);
      return elm;
    }
    props.key = props.key || (typeof window !== void 0 && window.btoa(JSON.stringify(props)) || Buffer.from(JSON.stringify(props)).toString("base64"));
    return new ReactElement(tag, props, children);
  };
  var createElement_default = createElement;

  // react/index.js
  var applets = [];
  var store = [];
  var contextStore = [];
  var ctxIndx = 0;
  var idx = 0;
  var useState = (initVal) => {
    const state = store[idx] || initVal;
    const _idx = idx;
    const setState = (newVal) => {
      if (typeof newVal === "function")
        newVal = newVal(store[_idx]);
      store[_idx] = newVal;
    };
    store[idx] = state;
    idx++;
    return [state, setState];
  };
  var useRef = (initValue) => {
    const state = useState({ current: initValue })[0];
    return state;
  };
  var useReducer = (reducer, initVal) => {
    const [state, setState] = useState(initVal);
    const dispatch = (action) => {
      return setState(reducer(action));
    };
    return [state, dispatch];
  };
  var createContext = (initVal) => {
    contextStore[idx] = initVal;
    const _idx = ctxIndx;
    const Provider = ({ value, children }) => {
      contextStore[_idx] = value;
      return { children };
    };
    ctxIndx++;
    return { index: _idx, Provider };
  };
  var useContext = ({ index }) => {
    return contextStore[index];
  };
  var renderDom = (cmpt, elm) => {
    applets.push({ cmpt, elm, vdom: {} });
  };
  setInterval(() => {
    idx = 0;
    applets.forEach((_, i) => {
      domRenderer_default(applets[i]);
    });
  }, 50);
  var React = {
    useState,
    useRef,
    useReducer,
    createContext,
    useContext,
    renderDom,
    createElement: createElement_default
  };
  var react_default = React;

  // styly-components/index.js
  var tags = ["a", "abbr", "acronym", "abbr", "address", "applet", "embed", "object", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "ul", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "del", "s", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
  var styleContainer = document.createElement("style");
  document.head.prepend(styleContainer);
  var styles = {};
  function uuid() {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return letters.map(() => letters[Math.floor(Math.random() * letters.length)]).slice(0, 15).join("");
  }
  var recomputeStyle = (className, computed) => {
    const newStyle = `.${className}{${computed.replace(/(\t|\r\n|\n|\r)/gm, "").replaceAll(" ", "")}}`;
    if (styles[className]?.style != newStyle) {
      styles[className] = styles[className] || {};
      styles[className]?.element?.remove();
      styles[className].style = newStyle;
      styles[className].element = document.createTextNode(styles[className].style);
      styleContainer.appendChild(styles[className].element);
    }
  };
  var styled = (Component) => {
    if (typeof Component === "string") {
      const cmp = styled[Component];
      return styled(cmp);
    }
    return (styles2, ...exprs) => {
      const className = uuid();
      return (props) => {
        let computed = exprs.reduce((result, exp, index) => {
          const isFunc = typeof exp === "function";
          const value = isFunc ? exp(props) : exp;
          return result + value + styles2[index + 1];
        }, styles2[0]);
        recomputeStyle(className, computed);
        const renderedComponent = Component(props);
        renderedComponent.props.className = `${className} ${renderedComponent.props.className || ""}`;
        return renderedComponent;
      };
    };
  };
  tags.forEach((TagName) => {
    styled[TagName] = (styles2, ...exprs) => {
      const cmp = (props) => /* @__PURE__ */ react_default.createElement(TagName, {
        ...props
      }, !!props.children.length || props.innerText);
      return styled(cmp)(styles2, ...exprs);
    };
  });
  var styly_components_default = styled;

  // src/components/Button/index.js
  var StyledButton = styly_components_default.button`
      width:100px;
      height:100px;
      backgroundColor:blue;
`;
  var Button = (props) => {
    const [clicked, updateClicked] = useContext(ButtonContext);
    const label = clicked ? "clicked" : "not clicked";
    return /* @__PURE__ */ react_default.createElement("button", {
      onclick: updateClicked
    }, [1, 2, 4]);
  };
  var Button_default = Button;

  // src/App.js
  var ButtonContext = createContext([]);
  var App = () => {
    const [clicked, updateClicked] = useState(false);
    const toggleClick = () => {
      updateClicked(clicked ? false : true);
    };
    return /* @__PURE__ */ react_default.createElement(ButtonContext.Provider, {
      value: [clicked, toggleClick]
    }, /* @__PURE__ */ react_default.createElement("div", {
      key: "key1"
    }, /* @__PURE__ */ react_default.createElement(Button_default, {
      clicked,
      onclick: toggleClick
    }, clicked ? "clicked" : "not clicked")));
  };
  var App_default = App;

  // index.js
  var root = document.getElementById("root");
  renderDom(App_default, root);
})();
