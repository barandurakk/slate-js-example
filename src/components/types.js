import { v4 as uuidv4 } from "uuid";

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const VOID_TYPES = ["name-variable", "tc-variable", "signer"];
export const CHECKLIST_TYPE = "check-list-item";

export const COLOR_OPTIONS = [
  { format: "colorized", color: "#000", text: "Black", isDefault: true },
  { format: "colorized", color: "#fff", text: "White" },
  { format: "colorized", color: "red", text: "Red" },
];

export const FONT_OPTIONS = [
  { format: "fontSize", size: 12, text: "12pt", isDefault: true },
  { format: "fontSize", size: 20, text: "18pt" },
  { format: "fontSize", size: 24, text: "20pt" },
];

export const defaultColorOption = COLOR_OPTIONS.find((opt) => opt.isDefault);
export const defaultFontSize = FONT_OPTIONS.find((opt) => opt.isDefault);

export const EMPTY_P = {
  type: "paragraph",
  children: [
    {
      type: "text",
      text: "",
      colorized: defaultColorOption.color,
      fontSize: defaultFontSize.size,
    },
  ],
};

export const EMPTY_PAGE = {
  type: "page",
  padding: 50,
  width: 794,
  height: 1123,
  borderColor: "#000",
  borderWidth: 1,
  // key: uuidv4(),
  children: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "",
          colorized: defaultColorOption.color,
          fontSize: defaultFontSize.size,
        },
      ],
    },
  ],
};

export const INLINE_FORMATS = [
  { format: "bold", text: "Bold" },
  { format: "italic", text: "İtalic" },
  { format: "underline", text: "Underline" },
];

export const BLOCK_FORMATS = [
  //   { format: "heading-one", text: "H1" },
  //   { format: "heading-two", text: "H2" },
  { format: "numbered-list", text: "Numbered-list" },
  { format: "bulleted-list", text: "Bulleted-list" },
];

export const CUSTOM_FORMATS = [
  { format: "name-variable", text: "Ad Soyad", attribute: "name" },
  { format: "tc-variable", text: "Tc Kimlik No", attribute: "tc" },
];

export const SIGNER_FORMATS = [{ format: "signer", text: "İmzacı Alanı" }];
