import React from "react";
import { getA4Height } from "./utils";
import Variable from "./Variable";

const Element = (props) => {
  //debugger;
  const { attributes, children, element } = props;
  let color = "#000";
  let fontSize = 16;
  let childrenNode = children;

  if (element.type.includes("variable")) {
    return <Variable {...props} />;
  }

  switch (element.type) {
    case "bulleted-list":
      childrenNode = <ul style={{ margin: 0 }}>{children}</ul>;
      break;
    case "heading-one":
      childrenNode = <h1 style={{ margin: 0 }}>{children}</h1>;
      break;
    case "heading-two":
      childrenNode = <h2 style={{ margin: 0 }}>{children}</h2>;
      break;
    case "list-item":
      childrenNode = <li style={{ margin: 0 }}>{children}</li>;
      break;
    case "numbered-list":
      childrenNode = <ol style={{ margin: 0 }}>{children}</ol>;
      break;
    case "page":
      return (
        <div
          className="page"
          {...attributes}
          style={{
            boxSizing: "border-box",
            width: 794,
            height: getA4Height(794),
            backgroundColor: "white",
            padding: 15,
            margin: "0rem 0rem",
          }}
        >
          {children}
        </div>
      );
    default:
      break;
  }

  return <div {...attributes}>{childrenNode}</div>;
};

export default Element;
