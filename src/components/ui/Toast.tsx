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

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className="bg-primary text-on-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-8 py-4 flex items-center gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {message}
      </div>
    </div>
  );
}
