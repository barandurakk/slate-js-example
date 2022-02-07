import React from "react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "./utils";

const BlockButton = ({ format, text }) => {
  const editor = useSlate();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: isBlockActive(editor, format) ? "red" : "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {text}
    </button>
  );
};

export default BlockButton;
