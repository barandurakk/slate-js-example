import React, { useRef, useEffect } from "react";
import { Editor, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import MarkButton from "./MarkButton";
import { Menu } from "./Menu/Menu";
import { Portal } from "./Portal";
import { INLINE_FORMATS } from "./types";

const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      // debugger;
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return (
    <Portal>
      <Menu ref={ref}>
        {INLINE_FORMATS.map((markBtn) => (
          <MarkButton format={markBtn.format} text={markBtn.text} />
        ))}
      </Menu>
    </Portal>
  );
};

export default HoveringToolbar;
