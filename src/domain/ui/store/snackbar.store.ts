import { create } from "zustand";

/* Snackbar Types */

export type SnackbarVariant = "success" | "error" | "info";

export interface SnackbarItem {
  id: string;
  message: string;
  variant: SnackbarVariant;
}

/* Store */

interface SnackbarStore {
  snackbars: SnackbarItem[];

  show: (payload: Omit<SnackbarItem, "id">) => void;
  remove: (id: string) => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  snackbars: [],

  show: ({ message, variant }) =>
    set((state) => ({
      snackbars: [
        ...state.snackbars,
        {
          id: crypto.randomUUID(),
          message,
          variant,
        },
      ],
    })),

  remove: (id) =>
    set((state) => ({
      snackbars: state.snackbars.filter((s) => s.id !== id),
    })),
}));
