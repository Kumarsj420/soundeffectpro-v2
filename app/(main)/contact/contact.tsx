'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Card from '@/app/components/Card';
import Button from '@/app/components/form/Button';
import Label from '@/app/components/form/Label';
import Input from '@/app/components/form/Input';
import Textarea from '@/app/components/form/Textarea';
import { Select, Option } from '@/app/components/form/Select';
import { Para , Head1} from '@/app/components/Ui';
import { messageCreateSchema } from '@/app/lib/validators/message.schema';
import { userService } from '@/app/services/userService';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import type { MessageType } from "@/app/services/userService";

export const messageTypes = [
    { id: 1, label: "Contact", value: "contact" },
    { id: 2, label: "Feedback", value: "feedback" },
    { id: 3, label: "Inquiry", value: "inquiry" },
    { id: 4, label: "Support", value: "support" },
    { id: 5, label: "Technical Issue", value: "technical issue" },
    { id: 6, label: "Other", value: "other" }
];

function ContactPage() {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    const [emailInp, setEmailInp] = useState(email ?? '');
    const [typeInp, setTypeInp] = useState<MessageType>('contact');
    const [contentInp, setContentInp] = useState('');

    const [emailTouched, setEmailTouched] = useState(false);
    const [typeTouched, setTypeTouched] = useState(false);
    const [contentTouched, setContentTouched] = useState(false);

    const emailSchema = messageCreateSchema.shape.senderEmail;
    const typeSchema = messageCreateSchema.shape.type;
    const contentSchema = messageCreateSchema.shape.content;

    const [emailError, setEmailError] = useState<string | null>(null);
    const [typeError, setTypeError] = useState<string | null>(null);
    const [contentError, setContentError] = useState<string | null>(null);

    const [triggerValidation, setTriggerValidation] = useState(false);

    useEffect(() => {
        if (email) {
            setEmailInp(email);
            setEmailTouched(true);
        }
    }, [email]);

    useEffect(() => {
        if (triggerValidation) {
            setEmailTouched(true);
            setTypeTouched(true);
            setContentTouched(true);

            const emailResult = emailSchema.safeParse(emailInp);
            const typeResult = typeSchema.safeParse(typeInp);
            const contentResult = contentSchema.safeParse(contentInp);

            if (!emailResult.success) {
                setEmailError(emailResult.error.issues[0].message);
            } else {
                setEmailError(null);
            }

            if (!typeResult.success) {
                setTypeError(typeResult.error.issues[0].message);
            } else {
                setTypeError(null);
            }

            if (!contentResult.success) {
                setContentError(contentResult.error.issues[0].message);
            } else {
                setContentError(null);
            }
        }
    }, [triggerValidation]);

    useEffect(() => {
        if (!emailTouched) return;
        const result = emailSchema.safeParse(emailInp);
        if (!result.success) {
            setEmailError(result.error.issues[0].message);
        } else {
            setEmailError(null);
        }
    }, [emailInp]);

    useEffect(() => {
        if (!typeTouched) return;
        const result = typeSchema.safeParse(typeInp);
        if (!result.success) {
            setTypeError(result.error.issues[0].message);
        } else {
            setTypeError(null);
        }
    }, [typeInp]);

    useEffect(() => {
        if (!contentTouched) return;
        const result = contentSchema.safeParse(contentInp);
        if (!result.success) {
            setContentError(result.error.issues[0].message);
        } else {
            setContentError(null);
        }
    }, [contentInp]);

    const handleSubmitMessage = async () => {
        setTriggerValidation(true);
        await new Promise(resolve => setTimeout(resolve, 0));

        const isValid = 
            emailSchema.safeParse(emailInp).success && 
            typeSchema.safeParse(typeInp).success && 
            contentSchema.safeParse(contentInp).success;

        if (!isValid) {
            toast.error('Please fill all fields correctly');
            setTriggerValidation(false);
            return;
        }

        openFetchLoading();

        try {
            const payload = {
                senderEmail: emailInp,
                type: typeInp,
                content: contentInp,
            };

            const res = await userService.postMessage(payload);

            if (res.success) {
                toast.success('Message sent successfully');
                toast.info('We will get back to you soon');
                
                // Reset form
                setEmailInp(email ?? '');
                setTypeInp('contact');
                setContentInp('');
                setEmailTouched(false);
                setTypeTouched(false);
                setContentTouched(false);
                setTriggerValidation(false);
            }

        } catch (error) {
            const err = error as AxiosError<{ 
                message: string; 
                errors?: Array<{ field: string; message: string }> 
            }>;

            if (err.response?.data?.errors) {
                // Handle validation errors from server
                err.response.data.errors.forEach((error) => {
                    if (error.field === 'senderEmail') setEmailError(error.message);
                    if (error.field === 'type') setTypeError(error.message);
                    if (error.field === 'content') setContentError(error.message);
                });
                toast.error('Validation failed');
            } else {
                toast.error(
                    err.response?.data?.message || "Failed to send message"
                );
            }
        } finally {
            closeFetchLoading();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-150 ">
            <Card className='rounded-2xl'>
                <div className="mb-6">
                    <Head1>Contact Us</Head1>
                    <Para className='mt-2 text-sm'>
                        Have a question or feedback? Send us a message and we'll get back to you as soon as possible.
                    </Para>
                </div>

                <form className="mt-5 space-y-5">
                    <div>
                        <Label htmlFor="contact-email" required>
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="contact-email"
                            placeholder="your.email@example.com"
                            value={emailInp}
                            onChange={(e) => {
                                if (!emailTouched) setEmailTouched(true);
                                setEmailInp(e.target.value);
                            }}
                            error={emailTouched ? emailError ?? undefined : undefined}
                            success={!emailError && emailTouched}
                        />
                    </div>

                    <div>
                        <Label htmlFor="contact-type" required>
                            Message Type
                        </Label>
                        <Select
                            maxHeight="md"
                            value={typeInp}
                            onChange={(val) => {
                                if (!typeTouched) setTypeTouched(true);
                                setTypeInp(val as MessageType);
                            }}
                            error={typeTouched ? typeError ?? undefined : undefined}
                            success={!typeError && typeTouched}
                        >
                            {messageTypes.map((item) => (
                                <Option key={item.id} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="contact-message" required>
                            Message
                        </Label>
                        <Textarea
                            id="contact-message"
                            placeholder="Tell us what's on your mind..."
                            className="resize-none"
                            rows={6}
                            value={contentInp}
                            onChange={(e) => {
                                if (!contentTouched) setContentTouched(true);
                                setContentInp(e.target.value);
                            }}
                            error={contentTouched ? contentError ?? undefined : undefined}
                            success={!contentError && contentTouched}
                        />
                        <Para className="text-sm mt-1 text-gray-500">
                            {contentInp.length}/600 characters
                        </Para>
                    </div>

                    <Button
                        size="md"
                        variant="primary"
                        type="button"
                        onClick={handleSubmitMessage}
                        className="w-full"
                    >
                        Send Message
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default ContactPage;