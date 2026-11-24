import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleX, X } from "lucide-react";
import { setApiNotifier } from "../lib/axios";
import { ToastContext } from "./toastState";
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);
  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);
  const toast = useCallback(
    (message, type = "success") => {
      const id = ++nextId.current;
      setToasts((items) => [...items, { id, message, type }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), type === "error" ? 8000 : 5000),
      );
    },
    [dismiss],
  );
  useEffect(() => {
    const activeTimers = timers.current;
    setApiNotifier(toast);
    return () => {
      setApiNotifier(null);
      activeTimers.forEach(clearTimeout);
      activeTimers.clear();
    };
  }, [toast]);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-label="Notifications">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`toast toast-${type}`}
            role={type === "error" ? "alert" : "status"}
          >
            <span>
              {type === "error" ? (
                <CircleX size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </span>
            <p>{message}</p>
            <button
              aria-label="Dismiss notification"
              onClick={() => dismiss(id)}
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
