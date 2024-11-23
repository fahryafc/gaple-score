// src/components/ui/toast.tsx

import React from "react";

export type ToastActionElement = React.ReactNode; // Atau tipe yang sesuai

export interface ToastProps {
  message: string;
  duration?: number;
  action?: ToastActionElement;
}

const Toast: React.FC<ToastProps & { open: boolean }> = ({
  message,
  duration = 3000,
  action,
  open, // Menambahkan open di sini
}) => {
  const [visible, setVisible] = React.useState(open); // Menggunakan open dari props

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      {message}
      {action && <div>{action}</div>}
    </div>
  );
};

export default Toast;
