import React, { useState } from "react";

import MathJax from 'react-mathjax';

const MathQ = (props) => {
  return (
    <MathJax.Provider> 
        <p style={{ fontSize: "18px" }}>
            <MathJax.Node inline formula={props.value} />
        </p>
    </MathJax.Provider>
  )
};

export default MathQ