import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";

const CheckListItemElement = ({ attributes, children, element }) => {
  const editor = useSlate();
  const readOnly = useReadOnly();
  const { checked } = element;
  return (
    <div
      {...attributes}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: 0,
      }}
    >
      <span contentEditable={false}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              checked: event.target.checked,
            };
            Transforms.setNodes(editor, newProperties, { at: path });
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          flex: 1,
          opacity: checked ? 0.666 : 1,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default CheckListItemElement;
