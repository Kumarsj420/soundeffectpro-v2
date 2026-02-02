'use client'
import { useState, useEffect } from 'react';
import Modal, { ModalHeader, ModalBody } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import { toast } from 'react-toastify';
import Label from '../form/Label';
import Input from '../form/Input';
import {

    Copy,
    Check,
} from 'lucide-react';

import {
    FaFacebook,
    FaSquareXTwitter,
    FaWhatsapp,
    FaTelegram,
    FaReddit,
    FaPinterest,
} from "react-icons/fa6";
import { IconType } from 'react-icons';
import { CardSpan, Para } from '../Ui';

interface contactData {
    url?: string;
}

interface ShareLink {
    name: string;
    icon: IconType;
    color: string;
    url: string;
}

function ShareModal() {
    const { isOpen, type, data, closeModal } = useModal();
    const { url = `${process.env.NEXT_PUBLIC_BASE_URL}` } = (data as contactData) || {};

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks: ShareLink[] = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            color: 'bg-blue-600 hover:bg-blue-500 shadow-blue-300/20',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: 'X (Twitter)',
            icon: FaSquareXTwitter,
            color: 'bg-black hover:bg-gray-900 shadow-gray-300/15',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        },
        {
            name: 'Reddit',
            icon: FaReddit,
            color: 'bg-orange-600 hover:bg-orange-500 shadow-orange-300/20',
            url: `https://reddit.com/submit?url=${encodeURIComponent(url)}`,
        },
  
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-green-600 hover:bg-green-500 shadow-green-300/20',
            url: `https://wa.me/?text=${encodeURIComponent(url)}`,
        },
        {
            name: 'Telegram',
            icon: FaTelegram,
            color: 'bg-blue-500 hover:bg-blue-400 shadow-blue-300/20',
            url: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
        },
  
        {
            name: 'Pinterest',
            icon: FaPinterest,
            color: 'bg-red-600 hover:bg-red-500 shadow-red-300/20',
            url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
        },
    ];

    const handleShare = (shareUrl: string) => {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };


    if (!isOpen || type !== 'share-modal') return null;



    return (
        <Modal open={isOpen} onClose={closeModal} >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                Share
            </ModalHeader>
            <ModalBody>
                <div >
                    <Label>
                        Page URL
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={url}
                            readOnly
                            wrapperClassName='flex-1'
                        />
                        <Button
                            onClick={handleCopy}
                            variant={copied ? 'success' : 'outline'}
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
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <CardSpan className="mb-3">
                        Share on Social Media
                    </CardSpan>
                    <div className="grid grid-cols-2 gap-3">
                        {shareLinks.map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <Button
                                    key={platform.name}
                                    onClick={() => handleShare(platform.url)}
                                    className={`flex items-center justify-center gap-2 ${platform.color} `}
                                >
                                    <Icon className='size-5' />
                                    {platform.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </ModalBody>

        </Modal>
    )
}

export default ShareModal;
