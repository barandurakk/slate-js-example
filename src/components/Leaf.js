import React from "react";

const Leaf = ({ attributes, children, leaf }) => {
  let color = "#000";
  let fontSize = 16;

  if (leaf.colorized) {
    color = leaf.colorized;
  }

  if (leaf.fontSize) {
    fontSize = leaf.fontSize;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span {...attributes} style={{ color, fontSize: `${fontSize}pt`, margin: 0 }}>
      {children}
    </span>
  );
};

export default Leaf;
