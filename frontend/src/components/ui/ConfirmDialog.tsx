import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            variant === "danger"
              ? "bg-red-500/10 text-red-400"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            className="flex-1"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
