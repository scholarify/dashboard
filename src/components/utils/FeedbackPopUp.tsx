// FeedbackPopup.jsx
import { X } from "lucide-react";

interface FeedbackPopupProps {
  status: "success" | "error";
  message: string;
  onClose: () => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ status, message, onClose }) => {
  const showPopup = status === "success" || status === "error";

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {status === "success" ? "Success" : "Error"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
