import React from "react";
import CheckListItemElement from "./CheckListItem";
import Signer from "./Signer";
import { COLOR_OPTIONS, EMPTY_PAGE, FONT_OPTIONS } from "./types";
import Variable from "./Variable";

const Element = (props) => {
  const { attributes, children, element } = props;
  let childrenNode = children;

  const defaultColorOption = COLOR_OPTIONS.find((opt) => opt.isDefault);
  const defaultFontSize = FONT_OPTIONS.find((opt) => opt.isDefault);

  if (element.type.includes("variable")) {
    return <Variable {...props} />;
  }

  if (element.type === "signer") {
    return <Signer {...props} />;
  }

  switch (element.type) {
    case "check-list-item":
      return <CheckListItemElement {...props} />;
    case "bulleted-list":
      childrenNode = (
        <ul style={{ margin: 0, fontSize: defaultFontSize.size, color: defaultColorOption.color }}>
          {children}
        </ul>
      );
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
      childrenNode = (
        <ol style={{ margin: 0, fontSize: defaultFontSize.size, color: defaultColorOption.color }}>
          {children}
        </ol>
      );
      break;
    case "page":
      return (
        <div
          className="page"
          {...attributes}
          style={{
            boxSizing: "border-box",
            width: EMPTY_PAGE.width,
            height: EMPTY_PAGE.height,
            backgroundColor: "white",
            padding: EMPTY_PAGE.padding,
            border: `${EMPTY_PAGE.borderWidth}px solid ${EMPTY_PAGE.borderColor}`,
            margin: "0rem 0rem",
          }}
        >
          {children}
        </div>
      );
    default:
      break;
  }

  return (
    <div {...attributes} style={{}}>
      {childrenNode}
    </div>
  );
};

export default Element;
