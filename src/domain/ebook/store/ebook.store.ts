import { create } from "zustand";
import type { EbookBlock } from "@/pages/ebook/types/block.types";

interface EbookStore {
  blocks: EbookBlock[];
  editingBlockId: string | null;

  setBlocks: (blocks: EbookBlock[]) => void;

  startEditing: (id: string) => void;
  cancelEditing: () => void;

  updateBlock: (id: string, content: string) => void;
}

export const useEbookStore = create<EbookStore>((set) => ({
  blocks: [],
  editingBlockId: null,

  setBlocks: (blocks) => set({ blocks }),

  startEditing: (id) => set({ editingBlockId: id }),

  cancelEditing: () => set({ editingBlockId: null }),

  updateBlock: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      editingBlockId: null,
    })),
}));
