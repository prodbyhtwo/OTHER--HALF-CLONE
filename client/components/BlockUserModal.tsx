import { X as CloseIcon, BellOff, Settings } from "lucide-react";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function BlockUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: BlockUserModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] border border-gray-200 z-50 max-w-[430px] mx-auto">
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-5">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-5">
          <h2 className="text-2xl font-bold text-black text-center">
            Block {userName}?
          </h2>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mx-6 mb-6" />

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Block info items */}
          <div className="flex items-center gap-4">
            <CloseIcon className="w-7 h-7 text-black flex-shrink-0" />
            <span className="text-lg text-black">
              They will not be able to find your profile and send you messages.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <BellOff className="w-7 h-7 text-black flex-shrink-0" />
            <span className="text-lg text-black">
              They will not be notified if you block them.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Settings className="w-7 h-7 text-black flex-shrink-0" />
            <span className="text-lg text-black">
              You can unblock them anytime in Settings.
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mx-6 mb-6" />

        {/* Action buttons */}
        <div className="px-6 pb-9">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-[#F7ECFF] text-[#9610FF] font-bold text-base rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 px-6 bg-[#9610FF] text-white font-bold text-base rounded-full"
            >
              Yes, Block
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
