import { useState, useRef } from "react";

import Icon from "@/components/common/Icon";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";

import type { EbookBlock, ButtonBlock } from "../types/block.types";
import Button from "@/components/ui/Button";

interface Props {
  block: EbookBlock;
  onEdit?: (content: string) => void;
  onCancel?: () => void;
  onStartEdit?: () => void;
  isEditing?: boolean;
}

const getBlockContent = (block: EbookBlock): string => {
  switch (block.type) {
    case "heading1":
    case "heading2":
    case "heading3":
    case "paragraph":
    case "quote":
    case "code":
    case "button":
      return String(block.content ?? "");
    default:
      return "";
  }
};

const BlockRenderer = ({
  block,
  onEdit,
  onCancel,
  onStartEdit,
  isEditing,
}: Props) => {
  const showSnackbar = useSnackbarStore((s) => s.show);

  const [hovered, setHovered] = useState(false);
  const [draftContent, setDraftContent] = useState(() =>
    getBlockContent(block)
  );

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  /* ---------------- Copy Handler ---------------- */

  const handleCopy = () => {
    navigator.clipboard.writeText(getBlockContent(block));

    setCopied(true);

    if (copyTimer.current) clearTimeout(copyTimer.current);

    copyTimer.current = setTimeout(() => {
      setCopied(false);
    }, 3000);

    showSnackbar({
      message: "Copied to clipboard",
      variant: "success",
    });
  };

  /* ---------------- Editing UI ---------------- */

  if (isEditing) {
    return (
      <div className="relative border rounded-lg p-4 bg-card">
        <textarea
          autoFocus
          value={draftContent}
          onChange={(e) => setDraftContent(e.target.value)}
          className="w-full border rounded p-2 text-sm mb-3 bg-[var(--color-background)]"
          rows={4}
        />

        <div className="flex gap-2">
          <Button
            variant="default"
            className="bg-primary text-white px-3 py-1 rounded text-sm"
            onClick={() => onEdit?.(draftContent)}
          >
            Save
          </Button>

          <Button
            variant="outline"
            className="border px-3 py-1 rounded text-sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- Normal Renderer ---------------- */

  const renderContent = () => {
    switch (block.type) {
      case "heading1":
        return <h1 className="text-4xl font-bold">{block.content}</h1>;

      case "heading2":
        return <h2 className="text-3xl font-bold">{block.content}</h2>;

      case "heading3":
        return <h3 className="text-2xl font-bold">{block.content}</h3>;

      case "paragraph":
        return <p>{block.content}</p>;

      case "image":
        return (
          <img
            src={block.content}
            alt={block.alt ?? ""}
            className="rounded-lg"
          />
        );

      case "code":
        return (
          <div className="bg-muted rounded">
            <div className="flex justify-between p-2">
              <span className="text-xs">{block.language}</span>

              <Icon
                name={copied ? "Check" : "Copy"}
                className="w-4 h-4 cursor-pointer mt-4"
                color={
                  copied
                    ? "var(--color-accent)"
                    : "var(--color-muted-foreground)"
                }
                onClick={handleCopy}
              />
            </div>

            <pre className="p-3 text-sm overflow-x-auto">{block.content}</pre>
          </div>
        );

      case "quote":
        return (
          <blockquote className="border-l-4 pl-3 italic">
            {block.content}
          </blockquote>
        );

      case "list":
        return (
          <ul className="list-disc ml-5">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case "numbered-list":
        return (
          <ol className="list-decimal ml-5">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );

      case "divider":
        return <hr />;

      case "button":
        return (
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() =>
              (block as ButtonBlock).onClick?.(block as ButtonBlock)
            }
          >
            {block.content}
          </button>
        );

      case "table":
        return (
          <table className="w-full border">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all ${
        hovered ? "shadow-lg" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* LEFT ACTION RAIL (Notion style) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Drag Handle */}
        <Icon
          name="GripVertical"
          className="w-4 h-4 text-muted-foreground cursor-grab"
        />

        {/* Edit Icon */}
        <Icon
          name="Pencil"
          className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground"
          onClick={onStartEdit}
        />
      </div>

      <div className="pl-6">{renderContent()}</div>

      {/* Block Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
          {block.type}
        </span>
      </div>
    </div>
  );
};

export default BlockRenderer;
