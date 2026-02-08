import type { EbookBlock, ButtonBlock } from "../types/block.types";

/*
  Optional external resolver for button actions
*/
type ButtonActionResolver = (block: ButtonBlock) => void;

export const generateLargeBlockData = (
  count = 500,
  resolveButtonAction?: ButtonActionResolver
): EbookBlock[] => {
  const blocks: EbookBlock[] = [];

  /* ---------- Static Sample Data ---------- */

  const sampleParagraphs = [
    "React is a powerful JavaScript library for building user interfaces.",
    "Performance optimization is crucial for modern web applications.",
    "React apps are made out of components.",
    "State management becomes challenging as applications grow.",
    "React is a JavaScript library for rendering user interfaces.",
  ];

  const codeSnippets = [
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    `const fetchData = async () => {
  const res = await fetch("/api/data");
  return res.json();
};`,
  ];

  const quotes = [
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    {
      text: "First, solve the problem. Then, write the code.",
      author: "John Johnson",
    },
  ];

  const listItems = [
    ["Reduce plastic waste", "Use renewable energy"],
    ["Testing improves reliability", "Automation saves time"],
  ];

  /* ---------- Generator Loop ---------- */

  for (let i = 0; i < count; i++) {
    const blockType = i % 15;

    switch (blockType) {
      case 0:
        blocks.push({
          id: `block-${i}`,
          type: "heading1",
          content: `Chapter ${Math.floor(i / 15) + 1}`,
        });
        break;

      case 1:
        blocks.push({
          id: `block-${i}`,
          type: "heading2",
          content: `Section ${i}`,
        });
        break;

      case 2:
      case 3:
      case 4:
        blocks.push({
          id: `block-${i}`,
          type: "paragraph",
          content: sampleParagraphs[i % sampleParagraphs.length],
        });
        break;

      case 5:
        blocks.push({
          id: `block-${i}`,
          type: "image",
          content: `https://picsum.photos/seed/${i}/800/400`,
          alt: `Illustration ${i}`,
          caption: `Figure ${i}`,
        });
        break;

      case 6:
        blocks.push({
          id: `block-${i}`,
          type: "code",
          content: codeSnippets[i % codeSnippets.length],
          language: "javascript",
        });
        break;

      case 7:
        blocks.push({
          id: `block-${i}`,
          type: "quote",
          content: quotes[i % quotes.length].text,
          author: quotes[i % quotes.length].author,
        });
        break;

      case 8:
        blocks.push({
          id: `block-${i}`,
          type: "list",
          items: listItems[i % listItems.length],
        });
        break;

      case 9:
        blocks.push({
          id: `block-${i}`,
          type: "numbered-list",
          items: listItems[i % listItems.length],
        });
        break;

      case 10:
        blocks.push({
          id: `block-${i}`,
          type: "divider",
        });
        break;

      /* ⭐ Assessment Task Implementation */
      case 11: {
        const buttonBlock: ButtonBlock = {
          id: `block-${i}`,
          type: "button",
          content: `Action Button ${i}`,
          onClick: resolveButtonAction,
        };

        blocks.push(buttonBlock);
        break;
      }

      case 12:
        blocks.push({
          id: `block-${i}`,
          type: "table",
          headers: ["Feature", "Before", "After"],
          rows: [
            ["Render Time", "850ms", "45ms"],
            ["Memory Usage", "245MB", "82MB"],
          ],
        });
        break;

      case 13:
        blocks.push({
          id: `block-${i}`,
          type: "heading3",
          content: `Subsection ${i}`,
        });
        break;

      case 14:
        blocks.push({
          id: `block-${i}`,
          type: "paragraph",
          content: "This section demonstrates mixed content blocks.",
        });
        break;
    }
  }

  return blocks;
};
