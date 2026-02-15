'use client'
import { Head1, Para, Head2, Head3, ListItem } from '@/app/components/Ui'
import InfoRow from '@/app/components/InfoRow'
import { CalendarDateRangeIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import GoogleAd from '@/app/components/ad';

function Community() {
    return (
        <>
            <Head1>
                Community Guidelines – Sound Effect Pro
            </Head1>
            <div className='max-w-sm'>
                <InfoRow icon={CalendarDateRangeIcon} label='Effective Date' value='05 February, 2026' />
                <InfoRow icon={CalendarDateRangeIcon} label='Last Update' value='05 February, 2026' />
            </div>

            <section className='mt-7'>
                <Para>
                    Sound Effect Pro is a fun place to share meme sounds and viral audio.
                    These guidelines help keep the community safe, respectful, and enjoyable for everyone.
                </Para>
            </section>

            <section className="mt-7">
                <Head2>1. Allowed Content</Head2>
                <Para>You may upload:</Para>
                <ul className='mt-2'>
                    <ListItem>Meme sounds and viral audio</ListItem>
                    <ListItem>Reaction sounds and soundboard clips</ListItem>
                    <ListItem>Original sound effects and voice recordings</ListItem>
                    <ListItem>Parody and satire (non-harmful)</ListItem>
                    <ListItem>Public domain or licensed audio</ListItem>
                    <ListItem>Audio you have permission to share</ListItem>
                </ul>
            </section>

            <section className="mt-7">
                <Head2>2. Prohibited Content</Head2>

                <Head3 className='mt-2'>Illegal or Copyright Infringing</Head3>
                <ul className='mt-2'>
                    <ListItem>Movie or TV audio without permission</ListItem>
                    <ListItem>Copyrighted music or songs</ListItem>
                    <ListItem>Audiobooks, podcasts, or paid content</ListItem>
                    <ListItem>Pirated or leaked material</ListItem>
                </ul>

                <Head3 className='mt-6'>Hate & Harassment</Head3>
                <ul className='mt-2'>
                    <ListItem>Hate speech or slurs</ListItem>
                    <ListItem>Bullying or harassment</ListItem>
                    <ListItem>Threats or violence</ListItem>
                </ul>

                <Head3 className='mt-6'>Adult & Unsafe Content</Head3>
                <ul className='mt-2'>
                    <ListItem>Pornographic or sexual audio</ListItem>
                    <ListItem>Sexual content involving minors</ListItem>
                    <ListItem>Graphic or disturbing violence</ListItem>
                </ul>

                <Head3 className='mt-6'>Spam & Platform Abuse</Head3>
                <ul className='mt-2'>
                    <ListItem>Repeated uploads or spam</ListItem>
                    <ListItem>Misleading titles or tags</ListItem>
                    <ListItem>Bots or automation</ListItem>
                    <ListItem>Attempts to hack or exploit the platform</ListItem>
                </ul>
            </section>

            <section className="mt-7">
                <Head2>3. Copyright Respect</Head2>
                <Para>
                    Upload only content you created, have permission to use, or that is public domain.
                    We respond to DMCA takedowns and may remove content at any time.
                </Para>
            </section>

            <section className="mt-7">
                <Head2>4. Respectful Behaviour</Head2>
                <ul className='mt-2'>
                    <ListItem>No harassment or bullying</ListItem>
                    <ListItem>No impersonation</ListItem>
                    <ListItem>No sharing personal information</ListItem>
                    <ListItem>Treat others respectfully</ListItem>
                </ul>
            </section>

            <section className="mt-7">
                <Head2>5. Moderation Actions</Head2>
                <Para>We may take action if rules are broken:</Para>
                <ul className='mt-2'>
                    <ListItem>Remove content</ListItem>
                    <ListItem>Issue warnings</ListItem>
                    <ListItem>Suspend accounts</ListItem>
                    <ListItem>Permanently ban users</ListItem>
                </ul>
            </section>

            <section className="mt-7">
                <Head2>6. User Responsibility</Head2>
                <Para>
                    You are responsible for your uploads and activity on the platform.
                    Violations may result in content removal or account termination.
                </Para>
            </section>

            <section className="mt-7">
                <Head2>Contact</Head2>
                <Para>If you have questions about these guidelines <Link href="/contact" className='text-blue-500 dark:text-blue-400 hover:underline'>contact us</Link>.</Para>
                <div className='mt-2 max-w-sm'>
                    <InfoRow icon={GlobeAltIcon} label='Website' value='Sound Effect Pro' />
                    <InfoRow icon={EnvelopeIcon} label='Email' value={process.env.NEXT_PUBLIC_SUPPORT_EMAIL!} />
                </div>
            </section>
            <GoogleAd
                slot="7619276466"
                format="autorelaxed"
                variant="multiplex"
            />
        </>
    )
}

export default Community
