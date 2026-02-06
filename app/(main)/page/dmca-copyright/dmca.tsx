'use client'
import { Head1, Para, Head2, Head3, ListItem } from '@/app/components/Ui'
import InfoRow from '@/app/components/InfoRow'
import { CalendarDateRangeIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';


function Dmca() {
    return (
        <>
            <Head1>
                DMCA Copyright Policy – Sound Effect Pro
            </Head1>
            <div className='max-w-sm'>
                <InfoRow icon={CalendarDateRangeIcon} label='Effective Date' value='05 February, 2026' />
                <InfoRow icon={CalendarDateRangeIcon} label='Last Update' value='05 February, 2026' />
            </div>
            <section className='mt-7'>
                <Para>
                   <Link href='/' className='text-blue-500 dark:text-blue-400 hover:underline'>Sound Effect Pro</Link> respects the intellectual property rights of others and expects users of our platform to do the same. This policy outlines how copyright owners can report alleged infringements and how we respond to such notices in accordance with the Digital Millennium Copyright Act (DMCA) and international copyright laws.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>1. Copyright Respect Statement</Head2>
                <Para>
                    Sound Effect Pro is a platform that hosts user-generated sound clips.
                    <br />
                    We do not claim ownership of user uploads and do not actively monitor all content.
                </Para>

                <Para>We are committed to:</Para>
                <ul className='mt-2'>
                    <ListItem>Responding promptly to valid copyright complaints</ListItem>
                    <ListItem>Removing infringing content when properly notified</ListItem>
                    <ListItem>Protecting the rights of copyright owners and users</ListItem>
                </ul>
            </section>
            <section className="mt-7">
                <Head2>2. Filing a DMCA Takedown Request</Head2>
                <Para>If you believe that content on Sound Effect Pro infringes your copyright, you may submit a DMCA Takedown Notice to request removal.</Para>

                <Para className="mt-2">Your request must be sent via email, the Report section, or Sound Effect Pro's <Link href='/contact'>Contact</Link> page and must include the required information listed below.</Para>
            </section>
            <section className="mt-7">
                <Head2>3. Required Information for Takedown Notice</Head2>
                <Para>To be valid, your DMCA notice must include:</Para>
                <br />
                <Head3>Identification of the copyrighted work</Head3>
                <ul className="mt-2">
                    <ListItem>Description of the original work claimed to be infringed.</ListItem>
                </ul>
                <br></br>
                <Head3>Identification of the infringing material</Head3>
                <ul className="mt-2">
                    <ListItem>Direct URL(s) of the sound clip or page on Sound Effect Pro.</ListItem>
                </ul>
                <br></br>
                <Head3>Your contact information</Head3>
                <ul className="mt-2">
                    <ListItem>Full legal name</ListItem>
                    <ListItem>Email address</ListItem>
                    <ListItem>Mailing address (optional but recommended)</ListItem>
                </ul>
                <br></br>
                <Head3>Good faith statement</Head3>
                <ul className="mt-2">
                    <ListItem>A statement that you believe in good faith that the use is not authorized by the copyright owner, its agent, or the law.</ListItem>
                </ul>
                <br></br>
                <Head3>Accuracy and authority statement</Head3>
                <ul className="mt-2">
                    <ListItem>A statement that the information in the notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.</ListItem>
                </ul>
                <br></br>
                <Head3>Example Statement</Head3>
                <Para className="mt-2">I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.
                    I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or authorized to act on behalf of the owner.
                </Para>
                <Para className="mt-2">
                    Incomplete notices may not be processed.
                </Para>
            </section>
            <section className='mt-7'>
                <Head2>4. DMCA Contact </Head2>
                <Para>You can send a takedown request by clicking the Report button under sound posts, or open the dropdown through the 3 dots on the bottom right and click the report button for particular sounds. Alternatively, you can also use Email (Check below) or our <Link href='/contact' className='text-blue-500 dark:text-blue-400 hover:underline'>Contact</Link> page. </Para>

            </section>
            <section className="mt-7">
                <Head2>5. Takedown Process</Head2>
                <Para>Upon receiving a valid DMCA notice, Sound Effect Pro will:</Para>
                <ul className="mt-2">
                    <ListItem>Review the complaint for completeness</ListItem>
                    <ListItem>Remove or disable access to the reported content</ListItem>
                    <ListItem>Notify the user who uploaded the content</ListItem>
                    <ListItem>Record the incident for repeat-infringer tracking</ListItem>
                </ul>
                <Para className="mt-2">We act promptly but do not guarantee specific timelines.</Para>
            </section>
            <section className="mt-7">
                <Head2>6. Counter-Notification Process</Head2>
                <Para>If you believe your content was removed by mistake or misidentification, you may submit a Counter-Notification.</Para>
                <Para className="mt-2">Your counter-notice must include:</Para>
                <ul className="mt-2">
                    <ListItem>Identification of the removed content and its previous location</ListItem>
                    <ListItem>Your full legal name and contact information</ListItem>
                    <ListItem>A statement under penalty of perjury that you have a good faith belief the content was removed due to error or misidentification</ListItem>
                    <ListItem>Consent to jurisdiction of the appropriate courts</ListItem>
                    <ListItem>Your electronic signature</ListItem>
                </ul>
                <br />
                <Head3>Counter-Notice Statement Example</Head3>
                <Para className="mt-2">“I consent to the jurisdiction of the courts and state that I will accept service of process from the person who submitted the DMCA complaint or their agent.”</Para>
                <Para className="mt-2">Send counter-notices to the same DMCA email address listed below.</Para>
                <Para className="mt-2">
                    If a valid counter-notice is received, we may restore the content unless the original complainant files a legal action within the legally required timeframe.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>7. Repeat Infringer Policy</Head2>
                <Para>Sound Effect Pro maintains a zero-tolerance policy for repeat copyright infringement.</Para>
                <Para className="mt-2">
                    We may:
                </Para>
                <ul className="mt-2">
                    <ListItem>Issue warnings</ListItem>
                    <ListItem>Remove uploaded content</ListItem>
                    <ListItem>Suspend accounts</ListItem>
                    <ListItem>Permanently terminate repeat infringers</ListItem>
                </ul>
                <Para className="mt-2">This action may occur without prior notice.</Para>
            </section>
            <section className="mt-7">
                <Head2>8. Misuse of DMCA Claims</Head2>
                <Para>Submitting false or misleading DMCA claims may result in legal liability.</Para>

                <Para className="mt-2">We reserve the right to take action against parties who abuse this process.</Para>
            </section>
            <section className="mt-7">
                <Head2>9. Changes to This Policy</Head2>
                <Para>We may update this policy periodically.
                </Para>
                <Para className="mt-2">Continued use of the platform constitutes acceptance of any updates.</Para>
            </section>

            <section className="mt-7">
                <Head2>10. Contact Information</Head2>
                <Para>If you have questions, concerns, or DMCA requests, <Link href="/contact" className='text-blue-500 dark:text-blue-400 hover:underline'>contact us</Link> :</Para>
                <div className='mt-2 max-w-sm'>
                    <InfoRow icon={GlobeAltIcon} label='Website' value='Sound Effect Pro' />
                    <InfoRow icon={EnvelopeIcon} label='Email' value={process.env.NEXT_PUBLIC_SUPPORT_EMAIL!} />
                </div>
                <Para className="mt-2">We aim to respond within a reasonable timeframe.</Para>
            </section>
        </>
    )
}

export default Dmca
