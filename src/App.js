import React, { useState, createContext, renderDom } from "../react/index.js"
import Button from "./components/Button/index.js"
import styled from "../styly-components/index.js"
export const ButtonContext = createContext([])

const App = () => {
      const [clicked, updateClicked] = useState(false);
      const toggleClick = () => {
            updateClicked(clicked ? false : true)
      }
      return (
            <ButtonContext.Provider value={[clicked, toggleClick]}>
                  <div key="key1">
                        <Button clicked={clicked} onclick={toggleClick}>
                              {clicked ? "clicked" : "not clicked"}
                        </Button>
                  </div>
            </ButtonContext.Provider>
      )
}
export default App;     