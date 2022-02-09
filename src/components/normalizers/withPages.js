import { Editor, Element, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { EMPTY_PAGE } from "../types";
import { setDefaultMarks } from "../utils";

const dirtyNodes = new Set();
let asyncPromise = Promise.resolve();
let isPageNormalize = false;

const setTimeRunClearn = (() => {
  let timer;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        isPageNormalize = false;
        dirtyNodes.clear();
        timer = null;
      });
    }
  };
})();
const heightWeakMap = new WeakMap();

export const withPages = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Text.isText(node)) {
      setDefaultMarks(editor, node, path);
      return normalizeNode(entry);
    }

    if (node.type === true) {
      debugger;
    }

    if (Element.isElement(node)) {
      // if the node is Page
      if (node.type === "page") {
        if (!isPageNormalize && !dirtyNodes.size) {
          asyncPromise.then(() => {
            computeRun(editor);
          });
        }
        if (!isPageNormalize) {
          if (!dirtyNodes.size) {
            const [prevNode] =
              Editor.previous(editor, {
                at: path,
              }) || [];
            if (prevNode) {
              !dirtyNodes.has(prevNode) && dirtyNodes.add(prevNode);
            }
          }
          !dirtyNodes.has(node) && dirtyNodes.add(node);
        }
        return;
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    return normalizeNode(entry);
  };
  return editor;
};

const computeRun = (editor) => {
  setTimeRunClearn();
  isPageNormalize = true;
  let pageNode;
  while (dirtyNodes.size) {
    const dirtyNodesArr = Array.from(dirtyNodes);
    pageNode = dirtyNodesArr.shift();
    dirtyNodes.delete(pageNode);
    const pageElement = getDom(editor, pageNode);
    const path = getPath(editor, pageNode);
    if (!path || !pageElement) {
      break;
    }
    const nextPagePath = [path[0] + 1];
    let nextPageNodeEntry;
    try {
      nextPageNodeEntry = Editor.node(editor, nextPagePath);
    } catch (error) {
      console.log(nextPagePath, "there is no next page");
    }
    const nextPageNode = nextPageNodeEntry && nextPageNodeEntry[0];
    const hasNextPage = !!nextPageNode;
    let countPageHeight = 0;

    const pageHeight = getPageHeight(pageElement);
    if (heightWeakMap.get(pageNode)) {
      countPageHeight = heightWeakMap.get(pageNode);
    } else {
      const {
        isOverStep,
        index: overIndex,
        countPageHeight: newCountPageHeight,
      } = getElementChildHeight(pageElement, countPageHeight, pageHeight);
      countPageHeight = newCountPageHeight;
      if (isOverStep && overIndex) {
        if (hasNextPage && nextPagePath) {
          moveChildToNextPage(editor, overIndex, path, nextPagePath);
          updateDirtyNode(editor, nextPagePath);
          break;
        } else {
          createPageAndMove(editor, overIndex, path, pageNode);
          break;
        }
      }
      heightWeakMap.set(pageNode, countPageHeight);
    }

    const prevPageNeedFill =
      countPageHeight < pageHeight && hasNextPage && nextPagePath && nextPageNode;
    // if current page have enough height can contain next page first child node,
    //  we need move this node
    if (prevPageNeedFill) {
      // console.log('if current page have enough height can contain next')
      let empytHeiht = pageHeight - countPageHeight;
      let nextPageElement = getDom(editor, nextPageNode);
      if (!nextPageElement) {
        break;
      }
      const nextPageChildren = Array.from(nextPageElement.children);
      // top bottom margin merge
      let preElementBottomMargin = 0;
      for (let index = 0; index < nextPageChildren.length; index++) {
        const nextPageChildNode = nextPageChildren[index];
        const { height: childHeight, marginBottom } = computeItemHeight(
          nextPageChildNode,
          preElementBottomMargin
        );
        preElementBottomMargin = marginBottom;
        if (empytHeiht < childHeight) break;
        empytHeiht = empytHeiht - childHeight;
        const toPath = path.concat([pageNode.children.length]);

        // riseElementToPrevPage(editor, index, nextPagePath, toPath);
        // if move done, this page is empty, remove this page
        // if (index === nextPageChildren.length - 1) {
        //   Transforms.removeNodes(editor, {
        //     at: nextPagePath,
        //   });
        // }
      }
    }
  }
};

const getDom = (editor, node) => {
  let nodeElement;
  try {
    nodeElement = ReactEditor.toDOMNode(editor, node);
  } catch (error) {
    console.error("DOM", error);
  }
  return nodeElement;
};

const getPath = (editor, node) => {
  let path;
  try {
    path = ReactEditor.findPath(editor, node);
  } catch (error) {
    console.log(error);
  }
  return path;
};

const getPageHeight = (PageNode) => {
  const style = window.getComputedStyle(PageNode);
  const computedHeight = PageNode.offsetHeight;
  const padding = parseFloat(style.paddingTop || "0") + parseFloat(style.paddingBottom || "0");

  const pageHeight = computedHeight - padding;
  return pageHeight;
};

const getElementChildHeight = (element, countPageHeight, pageHeight) => {
  // debugger;

  const children = Array.from(element.children);

  // top bottom margin merge
  let preElementBottomMargin = 0;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const { height: childHeight, marginBottom } = computeItemHeight(child, preElementBottomMargin);
    preElementBottomMargin = marginBottom;
    countPageHeight = countPageHeight + childHeight;
    if (countPageHeight > pageHeight) {
      return { isOverStep: true, index, countPageHeight };
    }
  }
  return { isOverStep: false, countPageHeight };
};

const computeItemHeight = (dom, mergeMargin) => {
  const style = window.getComputedStyle(dom);
  const clientHeight = dom.clientHeight;
  const marginTop = parseFloat(style.marginBottom);
  const mergeMarginVal = Math.max(marginTop - mergeMargin, 0);
  const marginBottom = parseFloat(style.marginBottom);
  const margin = mergeMarginVal + marginBottom;
  const padding = parseFloat(style.paddingBottom) + parseFloat(style.paddingTop);
  const border =
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.borderRightWidth) +
    parseFloat(style.borderTopWidth) +
    parseFloat(style.borderBottomWidth);

  const height = clientHeight + margin + padding + border;
  return { height, marginBottom: marginBottom };
};

const moveChildToNextPage = (editor, splitIndex, formPath, toPath) => {
  console.log("moveChildToNextPage");
  let nodePathIndex = 0;
  Transforms.moveNodes(editor, {
    at: formPath,
    match(n) {
      if (!Editor.isEditor(n) && Element.isElement(n)) {
        return nodePathIndex++ >= splitIndex;
      }
      return false;
    },
    to: toPath.concat([0]),
  });
};

const updateDirtyNode = (editor, path) => {
  Promise.resolve()
    .then(() => {
      let nextPageNodeEntry;
      try {
        nextPageNodeEntry = Editor.node(editor, path); // 还是要基于 slate 的数据结构
      } catch (error) {
        console.error(error);
      }
      const nextPageNode = nextPageNodeEntry && nextPageNodeEntry[0];
      !dirtyNodes.has(nextPageNode) && dirtyNodes.add(nextPageNode);
      return Promise.resolve();
    })
    .then(() => {
      computeRun(editor);
    });
};

const createPageAndMove = (editor, splitIndex, formPath, entryNode) => {
  console.log("createPageAndMove");
  // use index record nodes path, because node cant find path in this time.
  let nodePathIndex = 0;
  // need create page node
  Transforms.wrapNodes(editor, EMPTY_PAGE, {
    at: formPath,
    split: true,
    match(n) {
      if (!Editor.isEditor(n) && Element.isElement(n)) {
        // console.log((n as any).type, nodePathIndex, splitIndex)
        return nodePathIndex++ >= splitIndex;
      }
      return false;
    },
  });
  Transforms.moveNodes(editor, {
    at: formPath,
    match(n) {
      if (!Editor.isEditor(n) && Element.isElement(n) && n.type === "page" && n !== entryNode) {
        return true;
      }
      return false;
    },
    to: [formPath[0] + 1],
  });
};

const riseElementToPrevPage = (editor, splitIndex, formPath, toPath) => {
  console.log("riseElementToPrevPage");
  Transforms.moveNodes(editor, {
    at: formPath,
    // eslint-disable-next-line space-before-function-paren
    match(n) {
      if (!Editor.isEditor(n) && Element.isElement(n) && n.type !== "page") {
        let path;
        try {
          path = ReactEditor.findPath(editor, n);
        } catch (error) {
          return false;
        }
        return path[1] <= splitIndex;
      }
      return false;
    },
    to: toPath, // move to previous page last position
  });
};
