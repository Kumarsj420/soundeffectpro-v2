import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X, Check, Paperclip } from "lucide-react";

export interface SoundDetails {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface Soundboard {
  id: string;
  title: string;
  imageUrl?: string;
}

export interface AddToSoundboardModalProps {
  open: boolean;
  onClose: () => void;
  soundDetails: SoundDetails;
  soundboards: Soundboard[];
  onAdd?: (soundId: string, boardId: string) => void;
}

export default function AddToSoundboardModal({
  open,
  onClose,
  soundDetails,
  soundboards,
  onAdd,
}: AddToSoundboardModalProps) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(soundboards[0]?.id ?? null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!selectedBoard) return;
    setAdding(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onAdd?.(soundDetails.id, selectedBoard);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 900);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 after:absolute after:-z-10 after:inset-0.5 after:bg-zinc-900 after:rounded-[inherit]"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 text-zinc-400 hover:text-zinc-300 transition-transform hover:rotate-90"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-zinc-800/60 border border-zinc-700">
                <Paperclip size={20} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold text-white">
                  Add to Soundboard
                </DialogTitle>
                <p className="mt-1 text-sm text-zinc-400">
                  Select a soundboard to add this sound effect to.
                </p>
              </div>
            </div>

            {/* Sound details */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                  {soundDetails.thumbnailUrl ? (
                    <img src={soundDetails.thumbnailUrl} alt={soundDetails.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white truncate">{soundDetails.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">ID: <span className="text-zinc-300">{soundDetails.id}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Soundboards grid */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Choose Soundboard</label>
              <div className="rounded-2xl overflow-hidden ring-1 ring-zinc-700 ">
                <div className="grid grid-cols-1 gap-3 px-3 py-4 rounded-2xl h-72 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-zinc-700">
                  {soundboards.map((board) => (
                    <label
                      key={board.id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition-all ${selectedBoard === board.id ? "border-blue-500 bg-blue-900/10" : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600"
                        }`}
                    >
                      <input
                        type="radio"
                        name="soundboard"
                        className="h-4 w-4 accent-blue-500"
                        checked={selectedBoard === board.id}
                        onChange={() => setSelectedBoard(board.id)}
                      />
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                        {board.imageUrl ? (
                          <img src={board.imageUrl} alt={board.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{board.title}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selectedBoard || adding || added}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${added
                    ? "bg-green-600 text-white"
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                  } ${(!selectedBoard || adding) ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {adding ? "Adding..." : added ? <><Check size={16} /> Added</> : "Add to Soundboard"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
