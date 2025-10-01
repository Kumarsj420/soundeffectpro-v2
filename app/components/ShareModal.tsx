import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Facebook,
  Twitter,
  MessageCircle,
  Send,
  LucideIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

// ✅ Types
interface ShareModalProps {
  url: string;
  open: boolean;
  onClose: () => void;
}

interface ShareLink {
  name: string;
  icon: LucideIcon;
  color: string;
  url: string;
}

export default function ShareModal({ url, open, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks: ShareLink[] = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-500',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-400',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-400',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-closed:opacity-0"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-3">
        <DialogPanel
          transition
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 py-4 px-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 sm:py-7 sm:px-7 z-10 after:absolute after:-z-10 after:inset-0.5 after:bg-zinc-900 after:rounded-[inherit]"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-zinc-500 cursor-pointer hover:rotate-90 transition-transform duration-200 hover:text-zinc-400"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center">
            <DialogTitle
              as="h3"
              className="text-xl font-semibold text-white tracking-tight flex justify-center items-center gap-3"
            >
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Share2 size={20} className="text-blue-400" />
              </div>
              Share Link
            </DialogTitle>
            <p className="mt-3 text-sm text-zinc-400">
              Share this page with others via social media or copy the link.
            </p>
          </div>

          {/* Copy URL Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Page URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-white text-sm shadow-inner focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media Share */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              {shareLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform.url)}
                    className={`flex items-center justify-center gap-2 ${platform.color} text-white px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-lg`}
                  >
                    <Icon size={18} />
                    {platform.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}