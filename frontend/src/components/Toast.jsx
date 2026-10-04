import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ToastContext } from "../lib/useToast";
import { AlertIcon, CheckIcon } from "./Icons";

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", action) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((list) => [...list, { id, message, type, action }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), action ? 6000 : 3500);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-ink py-3 pl-4 pr-5 text-sm font-medium text-white"
          >
            {t.type === "success" && <CheckIcon className="shrink-0 text-signal" />}
            {t.type === "error" && <AlertIcon className="shrink-0 text-signal" />}
            <span className="truncate">{t.message}</span>
            {t.action && (
              <Link to={t.action.to} className="shrink-0 font-semibold text-signal underline underline-offset-4">
                {t.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
