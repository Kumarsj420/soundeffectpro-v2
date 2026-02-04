'use client'
import { useState, useEffect } from 'react';
import Modal, { ModalHeader, ModalBody } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import Label from '../form/Label';
import Input from '../form/Input';
import Textarea from '../form/Textarea';

import { IconType } from 'react-icons';
import { CardSpan, Para } from '../Ui';

import { Check, Copy } from "lucide-react";

interface SoundData {
    s_id?: string;
}

function EmbedModal() {
    const { isOpen, type, data, closeModal } = useModal();

    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');

    const { s_id = '' } = (data as SoundData) || {};

    const btnEmbed = `<iframe id="${s_id}"  height="110" src="${process.env.NEXT_PUBLIC_BASE_URL}embed/${s_id}?type=button" name="Sound Effect Pro ${s_id}" title="Sound Effect Pro ${s_id}" frameborder="0" scrolling="no" style="width: 100%; overflow: hidden"></iframe>`;

    const darkCode = `<iframe id="${s_id}-dark" height="342" src="${process.env.NEXT_PUBLIC_BASE_URL}embed/${s_id}?theme=dark" name="Sound Effect Pro ${s_id}" title="Sound Effect Pro ${s_id}" frameborder="0" scrolling="no" style="width: 100%; overflow: hidden; max-width:360px"></iframe>`;

    const lightCode = `<iframe id="${s_id}" height="342" src="${process.env.NEXT_PUBLIC_BASE_URL}embed/${s_id}?theme=light" name="Sound Effect Pro ${s_id}" title="Sound Effect Pro ${s_id}" frameborder="0" scrolling="no" style="width: 100%; overflow: hidden; max-width:360px"></iframe>`;

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(btnEmbed);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyCode = async () => {
        const code = cardTheme === 'dark' ? darkCode : lightCode;
        await navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    if (!isOpen || type !== 'embed-modal') return null;



    return (
        <Modal open={isOpen} onClose={closeModal} >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                Embed Sound
            </ModalHeader>
            <ModalBody>
                <div className='space-y-5'>
                    <div>
                        <Label htmlFor='embed-btn' className='mb-1'>Embed Button Only</Label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                id='embed-btn'
                                readOnly
                                value={btnEmbed}
                                wrapperClassName='w-full'
                            />
                            <Button
                                onClick={handleCopyUrl}
                                variant={copiedUrl ? 'success' : 'outline'}
                            >
                                {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
                            </Button>
                        </div>
                    </div>

                    <div >
                        <Label className='mb-1'>Embed Button Card</Label>
                        <div className="flex gap-2 mb-3">
                            <Button
                                onClick={() => setCardTheme('dark')}
                                variant={cardTheme === 'dark' ? 'primary' : 'outline'}
                                className='w-full'
                                size='sm'
                            >
                                Dark Card
                            </Button>
                            <Button
                                onClick={() => setCardTheme('light')}
                                variant={cardTheme === 'light' ? 'primary' : 'outline'}
                                className='w-full'
                                size='sm'
                            >
                                Light Card
                            </Button>
                        </div>

                        {/* Code Textarea */}
                        <div className="relative">
                            <Textarea
                                readOnly
                                value={cardTheme === 'dark' ? darkCode : lightCode}
                                rows={5}
                                className='resize-none'
                            />
                            <Button
                                onClick={handleCopyCode}
                                className={`absolute top-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium transition`}
                                variant={copiedCode ? 'success' : 'outline'}
                                size='auto'
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
                            </Button>
                        </div>
                    </div>

                </div>
            </ModalBody>

        </Modal>
    )
}

export default EmbedModal;
