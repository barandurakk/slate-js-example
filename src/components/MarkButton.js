import React from "react";
import { isMarkActive, toggleMark } from "./utils";
import { useSlate } from "slate-react";

const MarkButton = ({ format, text }) => {
  const editor = useSlate();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: isMarkActive(editor, format) ? "red" : "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {text}
    </button>
  );
};

export default MarkButton;
