import React from "react";

function Button(ariaLabelOptions, ariaLabelCondition) {
  return (
    <div>
      <button
        aria-label={
          ariaLabelCondition ? ariaLabelOptions[0] : ariaLabelOptions[1]
        }
        // aria-label={showPassword ? "Hide password" : "Show password"}
      ></button>
    </div>
  );
}

export default Button;
