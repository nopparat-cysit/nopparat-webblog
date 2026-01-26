import { useEffect } from "react";
import { X } from "lucide-react";

function Toast({ type = "error", title, message, onClose, isVisible, autoClose }) {
  useEffect(() => {
    if (!isVisible || !autoClose) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, autoClose);
    return () => clearTimeout(timer);
  }, [isVisible, autoClose, onClose]);
 
  if (!isVisible) return null;

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className="fixed bottom-4 right-4 left-4 z-50 animate-in slide-in-from-bottom-2 flex justify-end md:right-4">
      <div
        className={`${bgColor} text-white rounded-lg p-4 min-w-[320px] max-w-[500px]  shadow-lg`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-body-1 mb-1">{title}</h3>
            <p className="text-body-2 text-white/90">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
