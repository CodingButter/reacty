import React, { useContext, useMemo } from "../../../react/index.js"
import { ButtonContext } from "../../App.js"
import styled from "../../../styly-components"
import domRenderer from "../../../react/domRenderer/index.js"

const StyledButton = styled.button`
      width:100px;
      height:100px;
      backgroundColor:blue;
`
const add = (a, b) => {
      return a + b;
}
const Button = (props) => {
      const [clicked, updateClicked] = useContext(ButtonContext)
      // const memoizedAdd = useMemo(add)
      // const added = memoizedAdd(1, 4);
      // const added2 = memoizedAdd(1, 4);
      // const added3 = memoizedAdd(1, 6);
      const label = clicked ? "clicked" : "not clicked";
      return <button onclick={updateClicked}>{[1, 2, 4]}</button>
}
export default Button