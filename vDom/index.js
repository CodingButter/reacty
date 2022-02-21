#!/usr/bin/env node
import crud from "./elementCRUD.js";
import { ReactElement } from "../createElement";
const objectCompare = (obj1, obj2) => {
  if (
    obj1 === null ||
    obj1 === undefined ||
    obj2 === null ||
    obj2 === undefined
  )
    return true;
  const changed = Object.keys(obj1).some((k, i) => {
    if (obj2[k] === null || obj2[k] === undefined) return true;
    const t1 = typeof obj1[k];
    const t2 = typeof obj2[k];
    if (t1 !== t2) return true;
    if (t1 === "function" && obj1[k].toString() == obj2[k].toString())
      return false;
    if (obj1[k] != obj2[k]) return true;
  });

  return changed;
};

export const compare = (newDom, applet) => {
  const recursiveCompare = (nElm, vElm, parent) => {
    var creates = false;
    if (nElm instanceof ReactElement === false && !Array.isArray(nElm)) {
      nElm = {
        props: { isTextNode: true, content: nElm, children: [] },
        children: [],
      };
    }

    if (!vElm || !vElm.props) {
      vElm = {};
      creates = true;
      if (nElm.props.isTextNode) {
        vElm.element = document.createTextNode(nElm.props.content);
      } else {
        const existingElement = document.querySelector(
          `[butter-key="${nElm.props["butter-key"]}"]`
        );
        vElm.element = existingElement
          ? existingElement
          : nElm.tag && crud.create(nElm.tag, nElm.props);
      }
      vElm.props = nElm.props;
      vElm.children = [];
    }

    if (objectCompare(vElm.props, nElm.props)) {
      vElm.props = nElm.props;
      if (nElm.props.isTextNode) {
        vElm.element.nodeValue = nElm.props.content;
      } else crud.update(vElm.element, nElm.props);
    }

    if (vElm.children) {
      const nChildrenKeys = nElm?.props?.children?.map(
        (child) => child?.props?.key
      );
      nChildrenKeys &&
        vElm.children.forEach((child, index) => {
          if (nChildrenKeys.indexOf(child?.props?.key) == -1) {
            child.element.remove();
            vElm.children.splice(index, 1);
          }
        });
    }

    nElm?.children?.forEach((child, index) =>
      recursiveCompare(child, vElm.children[index], vElm)
    );

    if (creates) {
      if (parent.element && vElm.element) {
        if (childIDX !== undefined) {
          parent.children[childIDX] = vElm;
          parent.element.appendChild(vElm.element);
        } else {
          parent.children.push(vElm);
          parent.element.appendChild(vElm.element);
        }
      }
    }

    return vElm;
  };
  applet.vdom = recursiveCompare(newDom, applet.vdom, {
    children: [],
    element: applet.elm,
  });
};

const defaultReturn = {
  compare,
};

export default defaultReturn;
