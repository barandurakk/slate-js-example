import React from "react";
import { useSlateStatic } from "slate-react";
import { insertVariable, toggleMark } from "./utils";

const VariableButton = ({ format, text }) => {
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
        insertVariable(editor, format, text);
      }}
    >
      {text}
    </button>
  );
};

export default VariableButton;
