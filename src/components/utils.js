import _ from "lodash";
import { Editor, Transforms, Text, Element, Point, Range } from "slate";
import { Element as SlateElement } from "slate";
import { ReactEditor } from "slate-react";
import {
  LIST_TYPES,
  COLOR_OPTIONS,
  FONT_OPTIONS,
  EMPTY_PAGE,
  VOID_TYPES,
  CHECKLIST_TYPE,
  EMPTY_P,
} from "./types";

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
  let isNodeVariable = false;
  let nodePath;
  let voidNode;

  //check if selection is variable
  const selection = editor.selection && editor.selection.anchor.path;
  if (selection) {
    nodePath = selection.slice(0, selection.length - 1);
    if (nodePath) {
      voidNode = Editor.node(editor, nodePath) && Editor.node(editor, nodePath)[0];
      if (voidNode) isNodeVariable = voidNode.isVariable;
    }
  }

  if (isActive) {
    Editor.removeMark(editor, format);
    if (isNodeVariable) removeMarkFromVariable(editor, nodePath, format, voidNode);
  } else {
    Editor.addMark(editor, format, true);
    if (isNodeVariable) addMarkToVariable(editor, nodePath, format, voidNode);
  }
};

export const toggleColor = (editor, format, color) => {
  let isNodeVariable = false;
  let nodePath;
  let voidNode;

  //check if selection is variable
  const selection = editor.selection && editor.selection.anchor.path;
  if (selection) {
    nodePath = selection.slice(0, selection.length - 1);
    if (nodePath) {
      voidNode = Editor.node(editor, nodePath) && Editor.node(editor, nodePath)[0];
      if (voidNode) isNodeVariable = voidNode.isVariable;
    }
  }

  //remove other color marks
  Object.keys(Editor.marks(editor)).map((formats) => {
    if (formats === format) Editor.removeMark(editor, formats);
    return true;
  });
  //add new color mark to Editor.marks
  Editor.addMark(editor, format, color);
  if (isNodeVariable) addMarkToVariable(editor, nodePath, format, voidNode, color);
};

export const toggleFontSize = (editor, format, size) => {
  let isNodeVariable = false;
  let nodePath;
  let voidNode;

  //check if selection is variable
  const selection = editor.selection && editor.selection.anchor.path;
  if (selection) {
    nodePath = selection.slice(0, selection.length - 1);
    if (nodePath) {
      voidNode = Editor.node(editor, nodePath) && Editor.node(editor, nodePath)[0];
      if (voidNode) isNodeVariable = voidNode.isVariable;
    }
  }

  Object.keys(Editor.marks(editor)).map((formats) => {
    if (formats === format) Editor.removeMark(editor, formats);
    return true;
  });
  Editor.addMark(editor, format, size);
  if (isNodeVariable) addMarkToVariable(editor, nodePath, format, voidNode, size);
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

export const addMarkToVariable = (editor, path, format, node, value) => {
  if (value) {
    Transforms.setNodes(
      editor,
      {
        styles: {
          ...node.styles,
          text: {
            ...node.styles.text,
            [format]: value,
          },
        },
      },
      { at: path }
    );
  } else {
    Transforms.setNodes(
      editor,
      {
        styles: {
          ...node.styles,
          text: {
            ...node.styles.text,
            [format]: true,
          },
        },
      },
      { at: path }
    );
  }
};
export const removeMarkFromVariable = (editor, path, format, node) => {
  Transforms.setNodes(
    editor,
    {
      styles: {
        ...node.styles,
        text: {
          ...node.styles.text,
          [format]: false,
        },
      },
    },
    { at: path }
  );
};

export const insertVariable = (editor, format, text, attribute) => {
  const marks = Editor.marks(editor);
  const nodeText = { text: text };

  const voidNode = {
    type: format,
    isVoid: true,
    isInline: true,
    isVariable: true,
    data: {
      placeholder: text,
      attribute,
    },
    styles: {
      ...(!_.isEmpty(marks) && {
        text: { ...marks },
      }),
      container: {
        backgroundColor: format === "tc-variable" ? "blue" : "red",
      },
    },
    children: [nodeText],
  };

  Transforms.insertNodes(editor, voidNode);
  Transforms.move(editor);
  Object.keys(marks).map((mark) => {
    if (mark === "fontSize" || mark === "colorized") Editor.addMark(editor, mark, marks[mark]);
    else Editor.addMark(editor, mark, true);
    return true;
  });
};

export const insertPage = (editor) => {
  Transforms.insertNodes(editor, EMPTY_P, { at: [editor.children.length] });

  Transforms.wrapNodes(editor, EMPTY_PAGE, {
    at: [editor.children.length - 1],
  });
};

export const insertSigner = (editor, format) => {
  const nodeText = { text: "" };

  const voidNode = {
    type: format,
    isVoid: true,
    isInline: true,
    isSigner: true,
    width: 692 / 4,
    height: 50,
    children: [nodeText],
  };

  Transforms.insertNodes(editor, voidNode);
  Transforms.move(editor);
};

export const insertChecklist = (editor, format) => {
  const checkList = {
    type: "check-list-item",
    isCheckList: true,
    checked: false,
    children: [{ text: "Buraya yazınız..." }],
  };

  Transforms.insertNodes(editor, checkList);
};

export const withCustomVoids = (editor) => {
  const { isVoid, isInline } = editor;

  editor.isVoid = (element) => {
    return VOID_TYPES.includes(element.type) ? true : isVoid(element);
  };

  editor.isInline = (element) => {
    return VOID_TYPES.includes(element.type) ? true : isInline(element);
  };

  return editor;
};

export const withChecklists = (editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === CHECKLIST_TYPE,
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties = {
            type: "paragraph",
          };
          Transforms.setNodes(editor, newProperties, {
            match: (n) =>
              !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === CHECKLIST_TYPE,
          });
          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};

export const setDefaultMarks = (editor, node, path) => {
  const defaultColorOption = COLOR_OPTIONS.find((opt) => opt.isDefault);
  const defaultFontSize = FONT_OPTIONS.find((opt) => opt.isDefault);

  const nodeHasMarks =
    node[defaultColorOption.format] !== undefined && node[defaultFontSize.format] !== undefined;
  if (!nodeHasMarks) {
    Transforms.setNodes(
      editor,
      {
        type: "text",
        [defaultColorOption.format]: defaultColorOption.color,
        [defaultFontSize.format]: defaultFontSize.size,
      },
      { at: path }
    );
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
