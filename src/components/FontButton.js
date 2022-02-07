import React from "react";
import { isFontSizeActive, toggleFontSize } from "./utils";
import { useSlate } from "slate-react";

const FontButton = ({ format, text, size }) => {
  const editor = useSlate();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: isFontSizeActive(editor, format, size) ? "red" : "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleFontSize(editor, format, size);
      }}
    >
      {text}
    </button>
  );
};

export default FontButton;
