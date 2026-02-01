'use client'
import React, {useState} from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import { Para, CardSpan } from '../Ui';
import Badge from '../Badge';
import { useSession } from 'next-auth/react';
import { FlagIcon } from '@heroicons/react/24/solid';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { toast } from 'react-toastify';
import { fileService } from '@/app/services/fileService';
import Card from '../Card';
import SoundButton from '../SoundButton';
import { getR2Url } from '@/app/lib/r2/r2Url';
import { useLazyAudio } from '@/app/hooks/useAudio';
import Label from '../form/Label';
import Input from '../form/Input';
import Textarea from '../form/Textarea';
import { Select, Option } from '../form/Select';

interface SoundData {
    s_id?: string;
    title?: string;
    btnColor?: string;
}

export const reportReasons = [
    { id: 1, label: "Hate Speech", value: "hate speech" },
    { id: 2, label: "Abuse", value: "abuse" },
    { id: 3, label: "Inappropriate Content", value: "inappropriate content" },
    { id: 4, label: "Sexual Content", value: "sexual content" },
    { id: 5, label: "Harassment and Bullying", value: "harassment and bullying" },
    { id: 6, label: "Terrorism Advocacy", value: "terrorism advocacy" },
    { id: 7, label: "Misinformation", value: "misinformation" },
    { id: 8, label: "Spam or Scam", value: "spam and scams" },
    { id: 9, label: "Copyright Violation", value: "copyright violation" },
    { id: 10, label: "Privacy Violation", value: "privacy violation" },
    { id: 11, label: "Other", value: "other" }
];


function ReportModal() {
    const { isOpen, type, data, closeModal } = useModal();
    const { data: session } = useSession();
    const uid = session?.user?.uid;
    const email = session?.user?.email;
    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    const [emailInp, setEmailInp] = useState(email);
    const [typeInp, setTypeInp] = useState('');
    const [messageInp, setMessageInp] = useState('');

    const { s_id = '', title = '', btnColor = '' } = (data as SoundData) || {};

    const audioUrl = s_id ? getR2Url(`store/${s_id}.mp3`) : null;
    const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

    if (!isOpen || type !== 'report-modal') return null;

    return (
        <Modal open={isOpen} onClose={closeModal} maxWidth='xl' >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                <Badge variant='error' className='rounded-md size-7' size='auto'>
                    <FlagIcon className='size-4 text-red-100' />
                </Badge>
                <span className='text-error-500 dark:text-error-400'>Report</span>
            </ModalHeader>
            <ModalBody>
                <Card className='py-3.5'>
                    <div className="flex items-center gap-5">
                        <div className=" rounded-md overflow-hidden shrink-0">
                            <div className="size-18 flex items-center justify-center">
                                <div className="scale-70 ">
                                    <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="overflow-hidden flex flex-col gap-0.5">
                                    <Para paraHighlight className='capitalize truncate'>{title} | From Sound Effect Pro</Para>
                                    <CardSpan paraHighlight>ID: <span className="text-gray-500 dark:text-zinc-300">{s_id}</span></CardSpan>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <form className='mt-5 space-y-5'>
                    <div>
                        <Label htmlFor='report-email' required>Email</Label>
                        <Input type='email' id='report-email' placeholder='Your email' value={emailInp} onChange={(e) => setEmailInp(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor='report-reason' required>Reason</Label>
                        <Select maxHeight='md' value={typeInp} onChange={(val) => setTypeInp(val)}>
                            {
                                reportReasons.map((item) => (
                                    <Option key={item.id} value={item.value}>{item.label}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor='report-des' required>Message</Label>
                        <Textarea id='report-des' placeholder='Describe reason' className='min-h-30 resize-none' value={messageInp} onChange={(e) => setMessageInp(e.target.value)} />
                    </div>
                </form>

            </ModalBody>
            <ModalFooter>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        onClick={closeModal}
                        variant='outline'
                        size='sm'
                    >
                        Cancel
                    </Button>
                    <Button size='sm' variant='error' type='button'>
                        Report Sound
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ReportModal
