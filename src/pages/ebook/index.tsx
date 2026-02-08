import { useEffect, useCallback } from "react";

import Icon from "@/components/common/Icon";
import BlockRenderer from "./components/BlockRenderer";
import { generateLargeBlockData } from "./utils/blockData";

import { useEbookStore } from "@/domain/ebook/store/ebook.store";

import type { ButtonBlock } from "./types/block.types";

const EbookPage = () => {
  const {
    blocks,
    editingBlockId,
    setBlocks,
    startEditing,
    cancelEditing,
    updateBlock,
  } = useEbookStore();

  /* ---------------- Load Blocks ---------------- */

  useEffect(() => {
    const data = generateLargeBlockData(500, (block: ButtonBlock) => {
      alert(`Button "${String(block.content)}" clicked`);
    });

    setBlocks(data);
  }, [setBlocks]);

  /* ---------------- Drag & Drop ---------------- */

  const handleDrop = useCallback(
    (draggedId: string, targetId: string) => {
      if (draggedId === targetId) return;

      const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
      const targetIndex = blocks.findIndex((b) => b.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const updated = [...blocks];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, removed);

      setBlocks(updated);
    },
    [blocks, setBlocks]
  );

  /* ---------------- Editing ---------------- */

  const getEditHandler = useCallback(
    (id: string) => (content: string) => {
      updateBlock(id, content);
    },
    [updateBlock]
  );

  const getStartEditHandler = useCallback(
    (id: string) => () => {
      startEditing(id);
    },
    [startEditing]
  );

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 pt-8 flex items-center gap-3">
            <Icon name="BookOpen" className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">E-Book Viewer</h1>
          </div>

          {/* Blocks */}
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                draggable={!editingBlockId}
                onDragStart={(e) => e.dataTransfer.setData("blockId", block.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const dragged = e.dataTransfer.getData("blockId");
                  handleDrop(dragged, block.id);
                }}
                className={`transition ${
                  editingBlockId === block.id
                    ? "ring-2 ring-primary rounded-lg"
                    : ""
                }`}
              >
                <BlockRenderer
                  block={block}
                  isEditing={editingBlockId === block.id}
                  onStartEdit={getStartEditHandler(block.id)} // ⭐ FIX
                  onEdit={getEditHandler(block.id)}
                  onCancel={cancelEditing}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EbookPage;
