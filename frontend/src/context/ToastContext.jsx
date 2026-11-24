import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, CircleX, X } from "lucide-react";
import { useEffect } from "react";
import { setApiNotifier } from "../lib/axios";

const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const toast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);
  useEffect(() => { setApiNotifier(toast); return () => setApiNotifier(null); }, [toast]);
  return <ToastContext.Provider value={toast}>{children}<div className="toast-stack" aria-live="polite" aria-atomic="false">{toasts.map(({ id, message, type }) => <div key={id} className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}><span>{type === "error" ? <CircleX size={19}/> : <CheckCircle2 size={19}/>}</span><p>{message}</p><button aria-label="Dismiss notification" onClick={() => dismiss(id)}><X size={17}/></button></div>)}</div></ToastContext.Provider>;
}
export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error("useToast must be used inside ToastProvider"); return value; }
