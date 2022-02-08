export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const CUSTOM_TYPES = ["name-variable", "tc-variable"];

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

export const EMPTY_PAGE = {
  type: "page",
  padding: 50,
  width: 764,
  height: 1123,
  borderColor: "#000",
  borderWidth: 1,
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
  { format: "name-variable", text: "Ad Soyad" },
  { format: "tc-variable", text: "Tc Kimlik No" },
];
