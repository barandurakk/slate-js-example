import React from "react";
import { useSlateStatic } from "slate-react";
import { insertSigner, insertVariable, toggleMark } from "./utils";

const SignerButton = ({ format, text }) => {
  const editor = useSlateStatic();

  return (
    <button
      style={{
        color: "black",
        backgroundColor: "white",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        insertSigner(editor, format);
      }}
    >
      {text}
    </button>
  );
};

export default SignerButton;
