import React from "react";

function Button(text, type, onClick) {
  //ariaLabelOptions, ariaLabelCondition
  return (
    <div>
      <button
        type={type}
        onClick={onclick}
        // aria-label={
        //   ariaLabelCondition ? ariaLabelOptions[0] : ariaLabelOptions[1]
        // }
        // aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
