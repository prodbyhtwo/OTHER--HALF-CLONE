import React, { useState, useEffect } from "react";
import { Mic, X } from "lucide-react";

interface VoiceMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const VoiceMessageModal = ({
  isOpen,
  onClose,
  onSendMessage,
}: VoiceMessageModalProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setIsTranscribing(true);
      // Simulate voice recognition after a delay
      const timer = setTimeout(() => {
        setTranscribedText(
          "This might be a good opportunity for the two of us to get to know each other",
        );
        setIsTranscribing(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsListening(false);
      setTranscribedText("");
      setIsTranscribing(false);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (transcribedText) {
      onSendMessage(transcribedText);
      onClose();
    }
  };

  const handleStop = () => {
    setIsListening(false);
    if (transcribedText) {
      handleSend();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-auto flex flex-col items-center gap-8">
        {/* Header */}
        <h2 className="text-lg font-semibold text-black text-center">
          Stop talking to send...
        </h2>

        {/* Microphone Interface */}
        <div className="relative">
          {/* Outer pulse ring */}
          <div className="w-24 h-24 rounded-full bg-purple-100/50 flex items-center justify-center">
            {/* Inner microphone button */}
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Pulse animation */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-purple-200/30 animate-ping"></div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          {isTranscribing ? (
            <p className="text-lg text-black">Try saying something</p>
          ) : (
            <p className="text-lg text-black">{transcribedText}</p>
          )}

          <p className="text-sm text-gray-500">
            {isTranscribing ? "Listening..." : "Listening..."}
          </p>
        </div>

        {/* Auto-send when transcription is complete */}
        {transcribedText && !isTranscribing && (
          <div className="w-full">
            <button
              onClick={handleSend}
              className="w-full bg-purple-500 text-white py-3 rounded-full font-medium"
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceMessageModal;
