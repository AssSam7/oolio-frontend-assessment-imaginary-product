/* -------------------------------------------------------------------------- */
/* Ebook Block Types                                                          */
/* -------------------------------------------------------------------------- */

/*
  Base block shared properties
*/
export interface BaseBlock {
  id: string;
  type: BlockType;
}

/*
  Supported block types
*/
export type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "image"
  | "code"
  | "quote"
  | "list"
  | "numbered-list"
  | "divider"
  | "button"
  | "table";

/* -------------------------------------------------------------------------- */
/* Text Blocks                                                                */
/* -------------------------------------------------------------------------- */

export interface TextBlock extends BaseBlock {
  content: string;
}

export interface HeadingBlock extends TextBlock {
  type: "heading1" | "heading2" | "heading3";
}

export interface ParagraphBlock extends TextBlock {
  type: "paragraph";
}

/* -------------------------------------------------------------------------- */
/* Image Block                                                                */
/* -------------------------------------------------------------------------- */

export interface ImageBlock extends BaseBlock {
  type: "image";
  content: string; // image url
  alt?: string;
  caption?: string;
}

/* -------------------------------------------------------------------------- */
/* Code Block                                                                 */
/* -------------------------------------------------------------------------- */

export interface CodeBlock extends BaseBlock {
  type: "code";
  content: string;
  language?: string;
}

/* -------------------------------------------------------------------------- */
/* Quote Block                                                                */
/* -------------------------------------------------------------------------- */

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  content: string;
  author?: string;
}

/* -------------------------------------------------------------------------- */
/* List Blocks                                                                */
/* -------------------------------------------------------------------------- */

export interface ListBlock extends BaseBlock {
  type: "list" | "numbered-list";
  items: string[];
}

/* -------------------------------------------------------------------------- */
/* Divider Block                                                              */
/* -------------------------------------------------------------------------- */

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

/* -------------------------------------------------------------------------- */
/* Button Block (Assessment Critical)                                         */
/* -------------------------------------------------------------------------- */

export interface ButtonBlock extends BaseBlock {
  type: "button";
  content: string;

  /*
    Allows dynamic user defined callback
  */
  onClick?: (block: ButtonBlock) => void;
}

/* -------------------------------------------------------------------------- */
/* Table Block                                                                */
/* -------------------------------------------------------------------------- */

export interface TableBlock extends BaseBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

/* -------------------------------------------------------------------------- */
/* Union Type                                                                 */
/* -------------------------------------------------------------------------- */

export type EbookBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | CodeBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | ButtonBlock
  | TableBlock;
