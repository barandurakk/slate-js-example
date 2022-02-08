import React, { useEffect } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";

const Variable = (props) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, props.element);

  useEffect(() => {
    if (selected && focused) {
      const elementsMarks = props.element.styles.text;

      if (elementsMarks)
        Object.keys(elementsMarks).map((mark) => {
          if (mark === "fontSize" || mark === "colorized")
            Editor.addMark(editor, mark, elementsMarks[mark]);
          else Editor.addMark(editor, mark, true);
          return true;
        });
    }
  }, [selected, focused]);

  return (
    <>
      {props.element.styles && (
        <div
          {...props.attributes}
          style={{
            display: "inline-block",
            backgroundColor: props.element.styles.container.backgroundColor,
            boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none",
            cursor: "pointer",
            borderRadius: "10px",
            color: "white",
            margin: "0px 5px",
          }}
        >
          <div
            contentEditable={false}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: `${props.element.styles.text.fontSize}pt`,
                textDecoration: props.element.styles.text.underline ? "underline" : "none",
                fontWeight: props.element.styles.text.bold ? "bold" : "normal",
                fontStyle: props.element.styles.text.italic ? "italic" : "normal",
              }}
            >
              {props.element.data.placeholder}
            </span>

            {/* <button
            style={{
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "white",
              outline: "none",
              border: "none",
              padding: 0,
              marginLeft: "8px",
              // fontSize: props.element.data.textStyle.fontSize,
            }}
            onClick={() => Transforms.removeNodes(editor, { at: path })}
          >
            x
          </button> */}
          </div>
          {props.children}
        </div>
      )}
    </>
  );
};

export default Variable;
