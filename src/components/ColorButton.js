import React from "react";
import { isColorActive, isMarkActive, toggleColor } from "./utils";
import { useSlate } from "slate-react";

const ColorButton = ({ format, text, color }) => {
  const editor = useSlate();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: isColorActive(editor, format, color) ? "red" : "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleColor(editor, format, color);
      }}
    >
      {text}
    </button>
  );
};

export default ColorButton;
