import React, { useEffect } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";

const Signer = (props) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, props.element);

  return (
    <div
      {...props.attributes}
      style={{
        display: "inline-block",
        boxSizing: "border-box",
        backgroundColor: "#efefef",
        boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none",
        cursor: "pointer",
        padding: "5px 5px",
        color: "black",
        width: props.element.width,
        height: props.element.height,
      }}
    >
      {props.children}
      <div>
        <label>İmzacı Tarafı</label>
        <select>
          <option label="Seçim Yapınız" value="" />
          <option label="İmzacı (Ben)" value="signerMe" />
          <option label="İmzacı (Karşı Taraf)" value="signerMe" />
        </select>
      </div>
    </div>
  );
};

export default Signer;
