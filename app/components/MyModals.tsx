import React, { useState, memo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X, Check, Paperclip, Share2, Copy, LucideIcon, Flag, Clock, Code, Download } from "lucide-react";
import SoundButton from "./SoundButton";
import Dropdown from '../components/Dropdown';

// Add To Soundboard Modal

export interface SoundDetails {
    id: string;
    title: string;
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

export const AddToSoundboardModal = memo(function AddToSoundboardModal({
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
                className="fixed inset-0 bg-gray-500/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:bg-zinc-900 dark:after:rounded-[inherit] bg-white shadow-gray-400 dark:shadow-zinc-950"
                >
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-5 top-5 text-gray-500/70 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-transform hover:rotate-90"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-sky-500/15 border border-sky-400/25">
                                <Paperclip size={20} className="text-sky-400" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Add to Soundboard
                                </DialogTitle>
                                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                                    Select a soundboard to add this sound effect to.
                                </p>
                            </div>
                        </div>

                        {/* Sound details */}
                        <div className="rounded-xl border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900/40 px-4 py-2.5">
                            <div className="flex items-center gap-5">
                                <div className=" rounded-md overflow-hidden flex-shrink-0">
                                    <div className="mini-btn mt-1">
                                        <SoundButton />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="overflow-hidden">
                                            <div className="text-sm w-full font-medium text-gray-900 dark:text-white truncate">{soundDetails.title}</div>
                                            <div className="text-xs text-gray-900 dark:text-zinc-400 mt-0.5">ID: <span className="text-gray-500 dark:text-zinc-300">{soundDetails.id}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Soundboards grid */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-3">Choose Soundboard</label>
                            <div className="rounded-2xl overflow-hidden ring-1 ring-gray-300 dark:ring-zinc-700 ">
                                <div className="grid grid-cols-1 gap-3 px-3 py-4 rounded-2xl h-72 overflow-y-scroll scrollbar-mini scrollbar-thumb-blue-500 scrollbar-track-zinc-700">
                                    {soundboards.map((board) => (
                                        <label
                                            key={board.id}
                                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition-all ${selectedBoard === board.id ? "border-blue-400 bg-blue-500/10 dark:bg-blue-900/10" : "border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/40 dark:hover:border-zinc-600 hover:border-gray-400/90"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="soundboard"
                                                className="h-4 w-4 accent-blue-500"
                                                checked={selectedBoard === board.id}
                                                onChange={() => setSelectedBoard(board.id)}
                                            />
                                            <div className="w-12 h-12 rounded-md overflow-hidden bg-white dark:bg-zinc-800 flex-shrink-0 shadow">
                                                {board.imageUrl ? (
                                                    <img src={board.imageUrl} alt={board.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-zinc-500 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-gray-900 dark:text-white truncate">{board.title}</div>
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
                                className="rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition"
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
})


// Share Modal

interface ShareModalProps {
    url: string;
    open: boolean;
    onClose: () => void;
}

interface ShareLink {
    name: string;
    icon: LucideIcon | string;
    color: string;
    url: string;
}

export function ShareModal({ url, open, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const handleShare = (shareUrl: string) => {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal container */}
            <div className="fixed inset-0 z-10 flex items-center justify-center p-3">
                <DialogPanel
                    transition
                    className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:bg-zinc-900 dark:after:rounded-[inherit] bg-white shadow-gray-400 dark:shadow-zinc-950"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 text-gray-500/70 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-transform hover:rotate-90"
                    >
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div className="text-center">
                        <DialogTitle
                            as="h3"
                            className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight flex justify-center items-center gap-3"
                        >
                            <div className="p-2 bg-blue-500/20 ring-1 ring-blue-400/75 rounded-full">
                                <Share2 size={20} className="text-blue-400" />
                            </div>
                            Share Link
                        </DialogTitle>
                        <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
                            Share this page with others via social media or copy the link.
                        </p>
                    </div>

                    {/* Copy URL Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">
                            Page URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={url}
                                readOnly
                                className="flex-1 rounded-xl border border-gray-400/80 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800/80 px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${copied
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition'
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
                        <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-3">
                            Share on Social Media
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
                                className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 scale-110" viewBox="0 0 24 24"><path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" strokeWidth={0.01} stroke="currentColor"></path></svg>
                                Facebook
                            </button>

                            <button
                                onClick={() => handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`)}
                                className={`flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 scale-95" viewBox="0 0 24 24"><g fill="currentColor" strokeWidth={0.01} stroke="currentColor"><path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z"><animate fill="freeze" attributeName="d" dur="0.4s" values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z"></animate></path><path d="M3 2h5v0h-5zM16 22h5v0h-5z"><animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z"></animate></path><path d="M18.5 2h3.5L22 2h-3.5z"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.4s" values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"></animate></path></g></svg>
                                Twitter
                            </button>

                            <button
                                onClick={() => handleShare(`https://wa.me/?text=${encodeURIComponent(url)}`)}
                                className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 scale-105" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" strokeWidth={0.01} stroke="currentColor"></path></svg>
                                Whats App
                            </button>


                            <button
                                onClick={() => handleShare(`https://wa.me/?text=${encodeURIComponent(url)}`)}
                                className={`flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 scale-110" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5.788 14.02a1 1 0 0 0 .132.031a456 456 0 0 1 .844 2.002c.503 1.202 1.01 2.44 1.121 2.796c.139.438.285.736.445.94c.083.104.178.196.29.266a1 1 0 0 0 .186.088c.32.12.612.07.795.009a1.3 1.3 0 0 0 .304-.15L9.91 20l2.826-1.762l3.265 2.502q.072.055.156.093c.392.17.772.23 1.13.182c.356-.05.639-.199.85-.368a2 2 0 0 0 .564-.728l.009-.022l.003-.008l.002-.004v-.002l.001-.001a1 1 0 0 0 .04-.133l2.98-15.025a1 1 0 0 0 .014-.146c0-.44-.166-.859-.555-1.112c-.334-.217-.705-.227-.94-.209c-.252.02-.486.082-.643.132a4 4 0 0 0-.26.094l-.011.005l-16.714 6.556l-.002.001a2 2 0 0 0-.167.069a2.5 2.5 0 0 0-.38.212c-.227.155-.75.581-.661 1.285c.07.56.454.905.689 1.071c.128.091.25.156.34.199c.04.02.126.054.163.07l.01.003zm14.138-9.152h-.002l-.026.011l-16.734 6.565l-.026.01l-.01.003a1 1 0 0 0-.09.04a1 1 0 0 0 .086.043l3.142 1.058a1 1 0 0 1 .16.076l10.377-6.075l.01-.005a2 2 0 0 1 .124-.068c.072-.037.187-.091.317-.131c.09-.028.357-.107.645-.014a.85.85 0 0 1 .588.689a.84.84 0 0 1 .003.424c-.07.275-.262.489-.437.653c-.15.14-2.096 2.016-4.015 3.868l-2.613 2.52l-.465.45l5.872 4.502a.54.54 0 0 0 .251.04a.23.23 0 0 0 .117-.052a.5.5 0 0 0 .103-.12l.002-.001l2.89-14.573a2 2 0 0 0-.267.086zm-8.461 12.394l-1.172-.898l-.284 1.805zm-2.247-2.68l1.165-1.125l2.613-2.522l.973-.938l-6.52 3.817l.035.082a339 339 0 0 1 1.22 2.92l.283-1.8a.75.75 0 0 1 .231-.435" clipRule="evenodd" strokeWidth={0.01} stroke="currentColor"></path></svg>
                                Telegram
                            </button>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

interface ReportSoundProps {
    open: boolean
    onClose: () => void
    soundId: string
    title: string
}

const reportReasons = [
    { id: 1, val: "Inappropriate Content" },
    { id: 2, val: "Hate Speech" },
    { id: 3, val: "Sexual Content" },
    { id: 4, val: "Violence Promotion" },
    { id: 5, val: "Harassment & Bullying" },
    { id: 6, val: "Terrorism Advocacy" },
    { id: 7, val: "Misinformation" },
    { id: 8, val: "Spam & Scams" },
    { id: 9, val: "Copyright Violation" },
    { id: 10, val: "Privacy Violation" },
    { id: 11, val: "Other" },
]

export const ReportSound = memo(function ReportSound({
    open,
    onClose,
    soundId,
    title,
}: ReportSoundProps) {
    const [reason, setReason] = useState(reportReasons[0])
    const [description, setDescription] = useState("")

    const handleSubmit = () => {
        console.log({
            soundId,
            title,
            reason: reason.val,
            description,
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal container */}
            <div className="fixed inset-0 z-10 flex items-center justify-center p-3">
                <DialogPanel
                    transition
                    className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:bg-zinc-900 dark:after:rounded-[inherit] bg-white shadow-gray-400 dark:shadow-zinc-950"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 text-zinc-500 cursor-pointer hover:rotate-90 
            transition-transform duration-200 hover:text-zinc-400"
                    >
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-rose-500/15 border border-rose-400/25">
                                <Flag size={20} className="text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white ">
                                    Report Sound
                                </DialogTitle>
                                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                                    Report this sound if it is violating
                                </p>
                            </div>
                        </div>

                        {/* Sound Preview */}
                        <div className="rounded-xl border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900/40 px-4 py-2.5 mt-5">
                            <div className="flex items-center gap-5">
                                <div className="rounded-md overflow-hidden flex-shrink-0">
                                    <div className="mini-btn mt-1">
                                        <SoundButton />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="overflow-hidden">
                                            <div className="text-sm w-full font-medium text-gray-900 dark:text-white truncate">
                                                {title}
                                            </div>
                                            <div className="text-xs text-gray-900 dark:text-zinc-400 mt-0.5">
                                                ID:{" "}
                                                <span className="text-gray-500 dark:text-zinc-300">{soundId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="mt-6 space-y-5">
                        {/* Dropdown */}
                        <div>
                            <Dropdown
                                select={reportReasons}
                                label="Reason"
                                value={reason}
                                onChange={setReason}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-1">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe the issue in detail"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-zinc-200 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none outline-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold 
              text-white shadow-lg hover:bg-blue-400 transition"
                        >
                            Submit Report
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
})

// Embed Modal

export interface EmbedModalProps {
    open: boolean;
    onClose: () => void;
    embedUrl: string;
    soundTitle: string;
}

export const EmbedModal = memo(function EmbedModal({
    open,
    onClose,
    embedUrl,
    soundTitle,
}: EmbedModalProps) {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [codeType, setCodeType] = useState('html');

    const htmlCode = `<iframe src="${embedUrl}" width="300" height="100" frameborder="0" allowtransparency="true" allow="autoplay"></iframe>`;

    const reactCode = `<iframe
  src="${embedUrl}"
  width="300"
  height="100"
  frameBorder="0"
  allowTransparency={true}
  allow="autoplay"
/>`;

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(embedUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyCode = async () => {
        const code = codeType === 'html' ? htmlCode : reactCode;
        await navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:bg-zinc-900 dark:after:rounded-[inherit] bg-white shadow-gray-400 dark:shadow-zinc-950"
                >
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-5 top-5 text-gray-500/70 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-transform hover:rotate-90"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-purple-500/15 border border-purple-400/25">
                                <Code size={20} className="text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Embed This Button
                                </DialogTitle>
                                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                                    Copy the embed code to add this sound to your website.
                                </p>
                            </div>
                        </div>

                        {/* Embed URL */}
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">Embed URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={embedUrl}
                                    className="flex-1 rounded-xl border border-gray-400/80 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800/80 px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                                />
                                <button
                                    onClick={handleCopyUrl}
                                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${copiedUrl
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Code Type Toggle */}
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">Embed Code</label>
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => setCodeType('html')}
                                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${codeType === 'html'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    HTML
                                </button>
                                <button
                                    onClick={() => setCodeType('react')}
                                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${codeType === 'react'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-zinc-800  text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    React
                                </button>
                            </div>

                            {/* Code Textarea */}
                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={codeType === 'html' ? htmlCode : reactCode}
                                    rows={5}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-4 py-3 text-gray-900 dark:text-zinc-200 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none outline-none no-scrollbar"
                                />
                                <button
                                    onClick={handleCopyCode}
                                    className={`absolute top-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium transition ${copiedCode
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                                        }`}
                                >
                                    {copiedCode ? (
                                        <>
                                            <Check size={12} className="inline mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} className="inline mr-1" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
});



// Download Modal

export interface DownloadModalProps {
    open: boolean;
    onClose: () => void;
    soundId: string;
    onDownload?: (soundId: string) => void;
}

export const DownloadModal = memo(function DownloadModal({
    open,
    onClose,
    soundId,
    onDownload,
}: DownloadModalProps) {
    const countDuration = 7;
    const [countdown, setCountdown] = useState(countDuration);
    const [canDownload, setCanDownload] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (open) {
            setCountdown(countDuration);
            setCanDownload(false);
            setDownloading(false);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanDownload(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [open]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await new Promise((r) => setTimeout(r, 1000));
            onDownload?.(soundId);
            setTimeout(() => {
                setDownloading(false);
                onClose();
            }, 500);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 z-10 dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:bg-zinc-900 dark:after:rounded-[inherit] bg-white shadow-gray-400 dark:shadow-zinc-950"
                >
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-5 top-5 text-gray-500/70 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-transform hover:rotate-90"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-emerald-500/15 border border-emerald-400/25">
                                <Download size={20} className="text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Download Sound
                                </DialogTitle>
                                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                                    Your download will be ready shortly.
                                </p>
                            </div>
                        </div>


                        {/* Countdown or Download Button */}
                        <div className="flex flex-col items-center gap-4 py-6">
                            {!canDownload ? (
                                <>
                                    <button
                                        disabled
                                        className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition w-full bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-400 overflow-hidden h-12"
                                    >
                                        <span className="p-0.5 rounded-full bg-white dark:bg-zinc-900/60 flex size-7 items-center justify-center">
                                            {countdown}
                                        </span>

                                        <span
                                            className="absolute inset-0 -z-10 rounded-[inherit] bg-blue-500/15 transition-[width] duration-1000 ease-linear"
                                            style={{ width: `${(countdown / countDuration) * 100}%` }}
                                        />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition w-full h-12 ${downloading
                                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-400 text-white'
                                        }`}
                                >
                                    {downloading ? (
                                        'Downloading...'
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Download Now
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Ad Space */}
                        <div className="rounded-xl border border-dashed border-gray-400/80 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900/20 p-8 text-center">
                            <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide">Advertisement Space</p>
                            <p className="text-sm text-gray-600/90 dark:text-zinc-600 mt-2">Your ad could be here</p>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex items-center justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-zinc-300 hover:bg-gray-50 ring-1 dark:ring-0 ring-gray-300 ring-inset dark:hover:bg-zinc-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
});





