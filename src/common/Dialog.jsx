import { X } from "lucide-react";
import Button from "@/common/Button";

function Dialog({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "",
  description = "",
  confirmButtonText = "Save",
  cancelButtonText = "Cancel"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#EFEEEB] rounded-[16px] p-6 md:p-8 w-[90%] max-w-[400px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown-400 hover:text-brown-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="text-center flex flex-col gap-6">
          <h2 className="text-headline-3 text-brown-600 font-semibold">
            {title}
          </h2>

          <p className="text-body-1 text-brown-400">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
