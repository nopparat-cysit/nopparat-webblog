import { X } from "lucide-react";
import { Link } from "react-router-dom";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] p-6 md:p-8 w-[90%] max-w-[400px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown-400 hover:text-brown-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <h2 className="text-headline-4 text-brown-600 font-semibold mb-2">
            Create an account to continue
          </h2>

          {/* Create Account Button */}
          <Link
            to="/signup"
            className="block w-full py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300 mb-3"
          >
            Create account
          </Link>

          {/* Login Link */}
          <p className="text-body-2 text-brown-400">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-green font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
