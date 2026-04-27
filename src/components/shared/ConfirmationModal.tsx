"use client";

import { useEffect, useRef } from "react";
import { X, AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-[#f8f1eb] rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#b89a81] hover:text-[#4a3a2e] transition-colors"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
            isDestructive ? 'bg-red-50 text-red-500' : 'bg-brand-orange/10 text-brand-orange'
          }`}>
            <AlertCircle size={28} />
          </div>

          <h3 className="text-xl font-bold text-[#4a3a2e] mb-3">{title}</h3>
          <p className="text-sm font-medium text-[#6d5b4b] leading-relaxed mb-10">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={onConfirm}
              data-testid="confirm-delete-button"
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                isDestructive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600' 
                  : 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 hover:opacity-90'
              }`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-bold text-sm text-[#6d5b4b] bg-white border border-[#e6d5c5] hover:bg-[#ede1d5] transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
