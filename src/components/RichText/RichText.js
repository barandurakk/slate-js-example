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
  EMPTY_PAGE,
  FONT_OPTIONS,
  INLINE_FORMATS,
} from "../types";
import HoveringToolbar from "../HoveringToolbar";

const initialEditorValue = [EMPTY_PAGE];

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
      <div className="page-wrapper" style={{ height: "100vh" }}>
        <Editable
          onPaste={handleOnPaste}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>
    </Slate>
  );
};

export default RichText;
