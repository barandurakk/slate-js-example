import React, { useCallback, useMemo, useState, useRef } from "react";
import MarkButton from "../MarkButton";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor, Descendant, Node } from "slate";
import BlockButton from "../BlockButton";
import Leaf from "../Leaf";
import Element from "../Element";
import {
  getA4Height,
  setDefaultMarks,
  insertPage,
  withChecklists,
  withCustomVoids,
} from "../utils";
import { withPages } from "../normalizers/withPages";
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
  SIGNER_FORMATS,
  CHECKLIST_TYPE,
} from "../types";
import HoveringToolbar from "../HoveringToolbar";
import SignerButton from "../SignerButton";
import CheckListButton from "../CheckListButton";

const initialEditorValue = [EMPTY_PAGE];

const RichText = () => {
  const editorRef = useRef();
  if (!editorRef.current)
    editorRef.current = withPages(withCustomVoids(withChecklists(withReact(createEditor()))));
  const editor = editorRef.current;
  // const editor = useMemo(
  //   () => withPages(withCustomVoids(withChecklists(withReact(createEditor())))),
  //   []
  // );
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
    debugger;
    const item = e.clipboardData?.getData("text/html");
    console.log(e.clipboardData?.getData("html"));
    const text = e.clipboardData?.getData("text");
    if (text) {
      Transforms.insertText(editor, text);
    }
  };

  return (
    <Slate
      editor={editor}
      // onPaste={handleOnPaste}
      value={[EMPTY_PAGE]}
      onChange={(value) => {
        console.log("VALUE: ", value);
        console.log("CURSOR PATH: ", editor.selection.focus.path);
        setValue(value);
      }}
    >
      <div className={"toolbarWrapper"} contentEditable={false}>
        <HoveringToolbar />
        {INLINE_FORMATS.map((markBtn) => (
          <MarkButton format={markBtn.format} text={markBtn.text} />
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
        {SIGNER_FORMATS.map((sizeBtn) => (
          <SignerButton format={sizeBtn.format} text={sizeBtn.text} />
        ))}
        {CUSTOM_FORMATS.map((cstmBtn) => (
          <VariableButton
            format={cstmBtn.format}
            text={cstmBtn.text}
            attribute={cstmBtn.attribute}
          />
        ))}
        <CheckListButton format={CHECKLIST_TYPE} text="CheckList" />
        <button onClick={() => insertPage(editor)}>+</button>
      </div>
      <div
        className="page-wrapper"
        style={{ maxHeight: "calc(100vh - 22px)", boxSizing: "border-box" }}
      >
        <Editable
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
