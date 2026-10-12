"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss, duration]);

  // The live region stays mounted and only its content changes: a region that
  // appears together with its text is often not read out.
  return (
    <div role="status" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      {visible && (
        <div className="animate-slide-up bg-primary text-on-primary text-label-md px-8 py-4 flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {message}
        </div>
      )}
    </div>
  );
}
