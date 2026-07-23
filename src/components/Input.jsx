import React from "react";

function Input(label, type = "text") {
  return (
    <div>
      <label htmlFor={label}>{label}</label>

      <input id={label} type={type} />
    </div>
  );
}

export default Input;
