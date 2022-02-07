import React from "react";
import Variable from "./Variable";

const Element = (props) => {
  //debugger;
  const { attributes, children, element } = props;
  let color = "#000";
  let fontSize = 16;

  if (element.type.includes("variable")) {
    return <Variable {...props} />;
  }

  switch (element.type) {
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return (
        <p {...attributes} style={{ margin: "3px 0px", color, fontSize: `${fontSize}pt` }}>
          {children}
        </p>
      );
  }
};

export default Element;
