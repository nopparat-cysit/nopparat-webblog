import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RegistrationSuccess({ isVisible, onContinue }) {
  if (!isVisible) return null;

  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-brown-100 rounded-[16px] p-8 md:p-12 w-[90%] max-w-[500px] relative">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
          </div>

          {/* Success Message */}
          <h2 className="text-headline-3 md:text-headline-2 text-brown-600 font-semibold mb-8">
            Registration success
          </h2>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="px-12 py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
