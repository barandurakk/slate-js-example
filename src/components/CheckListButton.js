import React from "react";
import { useSlateStatic } from "slate-react";
import { insertChecklist } from "./utils";

const CheckListButton = ({ format, text }) => {
  const editor = useSlateStatic();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        insertChecklist(editor, format);
      }}
    >
      {text}
    </button>
  );
};

export default CheckListButton;
