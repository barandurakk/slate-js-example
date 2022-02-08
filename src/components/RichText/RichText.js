import React, { useCallback, useMemo, useState } from "react";
import MarkButton from "../MarkButton";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor, Descendant, Node } from "slate";
import BlockButton from "../BlockButton";
import Leaf from "../Leaf";
import Element from "../Element";
import { getA4Height, setDefaultMarks, withPages, withVariables } from "../utils";
import VariableButton from "../VariableButton";
import ColorButton from "../ColorButton";
import _ from "lodash";
import FontButton from "../FontButton";
import "./RichText.css";
import {
  BLOCK_FORMATS,
  COLOR_OPTIONS,
  CUSTOM_FORMATS,
  CUSTOM_TYPES,
  FONT_OPTIONS,
  INLINE_FORMATS,
} from "../types";
import HoveringToolbar from "../HoveringToolbar";
//import { withHistory } from "slate-history";

// const initialEditorValue = [
//   {
//     type: "paragraph",
//     children: [{ text: "" }],
//   },
// ];

const defaultColorOption = COLOR_OPTIONS.find((opt) => opt.isDefault);
const defaultFontSize = FONT_OPTIONS.find((opt) => opt.isDefault);

const initialEditorValue = [
  {
    type: "page",
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 764,
    height: getA4Height(794),
    children: [
      {
        type: "paragraph",
        children: [
          { text: "", colorized: defaultColorOption.color, fontSize: defaultFontSize.size },
        ],
      },
    ],
  },
];

const RichText = () => {
  const editor = useMemo(() => withPages(withVariables(withReact(createEditor()))), []);
  const [value, setValue] = useState(initialEditorValue);

  //elements
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const onKeyDown = useCallback((event) => {
    switch (event.key) {
      case "Tab":
        event.preventDefault();
        Editor.insertText(editor, "       ");
        break;
      default:
        break;
    }
  }, []);

  const handleOnPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text");
    console.log(
      text,
      "YES, this text was pasted but i need to insert the page break so i disabled it for now, WORK IN PROGRESS"
    );
    if (text) {
      Transforms.insertText(editor, text);
    }
  };

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        console.log("VALUE: ", value);
        // setDefaultMarks(editor);
        setValue(value);
      }}
    >
      <div className={"toolbarWrapper"} contentEditable={false}>
        <HoveringToolbar />
        {INLINE_FORMATS.map((markBtn) => (
          <MarkButton format={markBtn.format} text={markBtn.text} />
        ))}
        {CUSTOM_FORMATS.map((cstmBtn) => (
          <VariableButton format={cstmBtn.format} text={cstmBtn.text} />
        ))}
        {BLOCK_FORMATS.map((blockBtn) => (
          <BlockButton format={blockBtn.format} text={blockBtn.text} />
        ))}
        {COLOR_OPTIONS.map((colorBtn) => (
          <ColorButton format={colorBtn.format} text={colorBtn.text} color={colorBtn.color} />
        ))}
        {FONT_OPTIONS.map((sizeBtn) => (
          <FontButton format={sizeBtn.format} text={sizeBtn.text} size={sizeBtn.size} />
        ))}
      </div>
      <div className="page-wrapper" style={{ height: getA4Height(500) }}>
        <Editable
          // style={{
          //   width: 500,
          //   height: getA4Height(500),
          //   backgroundColor: "white",
          //   padding: 15,
          // }}
          onPaste={handleOnPaste}
          onClick={() => console.log("clicked!")}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          // placeholder={"Enter some text"}
          autoFocus
        />
      </div>
    </Slate>
  );
};

export default RichText;
