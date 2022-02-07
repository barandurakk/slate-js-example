import React from "react";
import { Transforms } from "slate";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";

const Variable = (props) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, props.element);

  return (
    <div
      {...props.attributes}
      style={{
        display: "inline-block",
        backgroundColor: props.element.data.bgColor,
        padding: "2px 5px",
        boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none",
        cursor: "pointer",
      }}
    >
      <div contentEditable={false}>
        <span>{props.element.data.placeholder}</span>
        <button
          style={{
            cursor: "pointer",
          }}
          onClick={() => Transforms.removeNodes(editor, { at: path })}
        >
          Sil
        </button>
      </div>
      {props.children}
    </div>
  );
};

export default Variable;
