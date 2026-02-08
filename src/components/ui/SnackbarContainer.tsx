import { useEffect } from "react";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";

const SnackbarContainer = () => {
  const snackbars = useSnackbarStore((s) => s.snackbars);
  const remove = useSnackbarStore((s) => s.remove);

  return (
    <div className="fixed bottom-5 right-5 space-y-3 z-[9999]">
      {snackbars.map((snack) => (
        <SnackbarItem key={snack.id} {...snack} onClose={remove} />
      ))}
    </div>
  );
};

export default SnackbarContainer;

/* Item */

interface Props {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
  onClose: (id: string) => void;
}

const SnackbarItem = ({ id, message, variant, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const styles = {
    success: "bg-success text-white",
    error: "bg-error text-white",
    info: "bg-primary text-white",
  };

  return (
    <div
      className={`px-4 py-3 rounded shadow-md min-w-[220px] animate-in fade-in slide-in-from-bottom ${styles[variant]}`}
    >
      {message}
    </div>
  );
};
