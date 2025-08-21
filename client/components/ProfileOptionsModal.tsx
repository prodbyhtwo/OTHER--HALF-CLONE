import { Share2, X as CloseIcon, Flag } from "lucide-react";

interface ProfileOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  onBlock: () => void;
  onReport: () => void;
}

export default function ProfileOptionsModal({
  isOpen,
  onClose,
  onShare,
  onBlock,
  onReport,
}: ProfileOptionsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-24 right-6 bg-white rounded-xl shadow-lg z-50 w-56 overflow-hidden">
        {/* Share this Profile */}
        <button
          onClick={onShare}
          className="flex items-center gap-3 w-full px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-6 h-6 text-black" />
          <span className="text-lg font-semibold text-black">
            Share this Profile
          </span>
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Block */}
        <button
          onClick={onBlock}
          className="flex items-center gap-3 w-full px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <CloseIcon className="w-6 h-6 text-black" />
          <span className="text-lg font-semibold text-black">Block</span>
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Report */}
        <button
          onClick={onReport}
          className="flex items-center gap-3 w-full px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <Flag className="w-6 h-6 text-black" />
          <span className="text-lg font-semibold text-black">Report</span>
        </button>
      </div>
    </>
  );
}
