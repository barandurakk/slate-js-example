import _ from "lodash";
import { Editor, Transforms, Text, Range, Node } from "slate";
import { Element as SlateElement } from "slate";
import { ReactEditor } from "slate-react";
import { CUSTOM_FORMATS, CUSTOM_TYPES, LIST_TYPES, COLOR_OPTIONS, FONT_OPTIONS } from "./types";

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format] === true : false;
};

export const isColorActive = (editor, format, color) => {
  const marks = Editor.marks(editor);

  return marks ? (marks[format] ? marks[format] === color : false) : false;
};

export const isFontSizeActive = (editor, format, size) => {
  const marks = Editor.marks(editor);

  return marks ? (marks[format] ? marks[format] === size : false) : false;
};

export const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const toggleColor = (editor, format, color) => {
  const isActive = isColorActive(editor, format, color);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Object.keys(Editor.marks(editor)).map((formats) => {
      if (formats === format) Editor.removeMark(editor, formats);
      return true;
    });
    Editor.addMark(editor, format, color);
  }
};

export const toggleFontSize = (editor, format, size) => {
  const isActive = isFontSizeActive(editor, format, size);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Object.keys(Editor.marks(editor)).map((formats) => {
      if (formats === format) Editor.removeMark(editor, formats);
      return true;
    });
    Editor.addMark(editor, format, size);
  }
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && LIST_TYPES.includes(n.type),
    split: true,
  });

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const insertVariable = (editor, format, text) => {
  const nodeText = { text: text };
  const voidNode = {
    type: format,
    isVoid: true,
    data: {
      placeholder: text,
      bgColor: format === "tc-variable" ? "yellow" : "red",
    },
    children: [nodeText],
  };

  const marks = Editor.marks(editor);
  Transforms.insertNodes(editor, voidNode);
  Transforms.move(editor);
  Object.keys(marks).map((mark) => {
    if (mark === "fontSize" || mark === "colorized") Editor.addMark(editor, mark, marks[mark]);
    else Editor.addMark(editor, mark, true);
    return true;
  });
};

export const withVariables = (editor) => {
  const { isVoid, isInline } = editor;

  editor.isVoid = (element) => {
    return CUSTOM_TYPES.includes(element.type) ? true : isVoid(element);
  };

  editor.isInline = (element) => {
    return CUSTOM_TYPES.includes(element.type) ? true : isInline(element);
  };

  return editor;
};

export const setDefaultMarks = (editor) => {
  const marks = Editor.marks(editor);
  const defaultColorOption = COLOR_OPTIONS.find((opt) => opt.isDefault);
  const defaultFontSize = FONT_OPTIONS.find((opt) => opt.isDefault);

  if (_.isEmpty(marks) && defaultColorOption && defaultFontSize) {
    Editor.addMark(editor, defaultColorOption.format, defaultColorOption.color);
    Editor.addMark(editor, defaultFontSize.format, defaultFontSize.size);
  }
};

export const getA4Height = (width) => {
  const ratioH = 1.4142;
  const ratioW = 1;

  return parseFloat((width * ratioH) / ratioW);
};

export const getRandomColor = () => {
  return `hsl(${360 * Math.random()} , ${25 + 70 * Math.random()}% , ${50 + 10 * Math.random()}%)`;
};
