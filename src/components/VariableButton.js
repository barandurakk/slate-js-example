import React from "react";
import { useSlateStatic } from "slate-react";
import { insertVariable, toggleMark } from "./utils";

const VariableButton = ({ format, text, attribute }) => {
  const editor = useSlateStatic();
  console.log(text);

  return (
    <button
      style={{
        color: "black",
        backgroundColor: "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        insertVariable(editor, format, text, attribute);
      }}
    >
      {text}
    </button>
  );
};

export default VariableButton;
