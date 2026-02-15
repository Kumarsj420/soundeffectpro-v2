"use client"
import { Head1, Para, Head2, Head3, ListItem } from '@/app/components/Ui'
import InfoRow from '@/app/components/InfoRow'
import { CalendarDateRangeIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import GoogleAd from '@/app/components/ad';

function Terms() {
    return (
        <>
            <Head1>
                Terms and Conditions – Sound Effect Pro
            </Head1>
            <div className='max-w-sm'>
                <InfoRow icon={CalendarDateRangeIcon} label='Effective Date' value='05 February, 2026' />
                <InfoRow icon={CalendarDateRangeIcon} label='Last Update' value='05 February, 2026' />
            </div>
            <section className='mt-7'>
                <Para>
                    Welcome to <Link href='/' className='text-blue-500 dark:text-blue-400 hover:underline'>Sound Effect Pro</Link> (“Platform”, “we”, “our”, “us”).These Terms and Conditions (“Terms”) govern your access to and use of our website and services.
                    <br></br>
                    By accessing or using Sound Effect Pro, you agree to be bound by these Terms. If you do not agree, please do not use the platform.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>1. About Sound Effect Pro</Head2>
                <Para>Sound Effect Pro is a community platform that allows users to:</Para>

                <ul className='mt-2'>
                    <ListItem>Upload and share short sound clips (under 2 minutes)</ListItem>
                    <ListItem>Create soundboards</ListItem>
                    <ListItem>Share public sound links</ListItem>
                    <ListItem>Manage user profiles</ListItem>
                    <ListItem>Log in via OAuth providers or email magic links</ListItem>
                </ul>

                <Para className="mt-2">Sound Effect Pro hosts user-generated content.</Para>
            </section>
            <section className="mt-7">
                <Head2>2. Eligibility</Head2>
                <Para>To use the platform, you must:</Para>
                <ul className="mt-2">
                    <ListItem>Be at least 13 years old</ListItem>
                    <ListItem>Have the legal capacity to enter into these Terms</ListItem>
                    <ListItem>Comply with all applicable laws in your country</ListItem>
                </ul>
                <Para className="mt-2">If you are under 18, you must use the platform with parental or guardian permission.</Para>
            </section>
            <section className="mt-7">
                <Head2>3. User Accounts</Head2>
                <Para>You may create an account using:</Para>
                <ul className="mt-2">
                    <ListItem>Google OAuth</ListItem>
                    <ListItem>Discord OAuth</ListItem>
                    <ListItem>Twitch OAuth</ListItem>
                    <ListItem>Email Magic Link</ListItem>
                </ul>

                <Para className='mt-2'>You agree to:</Para>
                <ul className="mt-2">
                    <ListItem>Provide accurate information</ListItem>
                    <ListItem>Maintain the security of your account</ListItem>
                    <ListItem>Be responsible for all activity under your account</ListItem>
                    <ListItem>Notify us of unauthorized access immediately</ListItem>
                </ul>
                <Para className="mt-2">We are not liable for loss resulting from unauthorized account use.</Para>
            </section>
            <section className='mt-7'>
                <Head2>4. User Responsibilities</Head2>
                <Para>When using Sound Effect Pro, you agree that you will:</Para>
                <ul className="mt-2">
                    <ListItem>Use the platform lawfully and respectfully</ListItem>
                    <ListItem>Upload only content you own or have permission to use</ListItem>
                    <ListItem>Respect the rights of others</ListItem>
                    <ListItem>Not misuse or attempt to disrupt the platform</ListItem>
                </ul>
                <Para className="mt-2">You are solely responsible for the content you upload or share.</Para>
            </section>
            <section className="mt-7">
                <Head2>5. User-Generated Content</Head2>
                <Para>Users may upload sound clips and create soundboards.</Para>
                <Para className="mt-2">You retain ownership of your content. However, by uploading content, you grant Sound Effect Pro a worldwide, non-exclusive, royalty-free license to:</Para>
                <ul className="mt-2">
                    <ListItem>Host</ListItem>
                    <ListItem>Store</ListItem>
                    <ListItem>Display</ListItem>
                    <ListItem>Stream</ListItem>
                    <ListItem>Distribute</ListItem>
                    <ListItem>Share publicly on the platform</ListItem>
                </ul>
                <Para className="mt-2">This license exists only to operate and promote the service.</Para>
                <Para className="mt-2">You may delete your content at any time.</Para>
            </section>
            <section className="mt-7">
                <Head2>6. Copyright and Intellectual Property</Head2>
                <Para>You must only upload content that you:</Para>
                <ul className="mt-2">
                    <ListItem>Created yourself, OR</ListItem>
                    <ListItem>Have legal rights or permission to use</ListItem>
                </ul>
                <Para className="mt-2">Upon Uploading copyrighted content without permission is strictly prohibited.</Para>
                <Para className="mt-2">If you believe your copyright has been violated, you may submit a takedown request via our contact email.</Para>
                <Para className="mt-2">We reserve the right to remove content upon receiving valid complaints.</Para>
            </section>
            <section className="mt-7">
                <Head2>7. Prohibited Content</Head2>
                <Para>You agree not to upload, share, or distribute content that includes:</Para>
                <br />
                <Head3>Illegal Content</Head3>
                <ul className="mt-2">
                    <ListItem>Copyright infringement</ListItem>
                    <ListItem>Pirated audio or media</ListItem>
                    <ListItem>Fraud or scams</ListItem>
                </ul>
                <br />
                <Head3>Harmful or Abusive Content</Head3>
                <ul className="mt-2">
                    <ListItem>Hate speech</ListItem>
                    <ListItem>Harassment or bullying</ListItem>
                    <ListItem>Threats or violence</ListItem>
                    <ListItem>Defamation</ListItem>
                </ul>
                <br />
                <Head3>Explicit or Inappropriate Content</Head3>
                <ul className="mt-2">
                    <ListItem>Pornographic material</ListItem>
                    <ListItem>Sexual exploitation content</ListItem>
                    <ListItem>Content involving minors</ListItem>
                    <ListItem>Graphic violence</ListItem>
                </ul>
                <br />
                <Head3>Platform Abuse</Head3>
                <ul className="mt-2">
                    <ListItem>Spam or misleading metadata</ListItem>
                    <ListItem>Malware or harmful code</ListItem>
                    <ListItem>Attempts to hack or exploit the platform</ListItem>
                    <ListItem>Automated scraping or mass downloads</ListItem>
                </ul>
                <Para className="mt-2">We may remove any content that violates these rules.</Para>
            </section>
            <section className="mt-7">
                <Head2>8. Content Moderation</Head2>
                <Para>We reserve the right to:</Para>
                <ul className="mt-2">
                    <ListItem>Review uploaded content</ListItem>
                    <ListItem>Remove content at our discretion</ListItem>
                    <ListItem>Restrict visibility or access</ListItem>
                    <ListItem>Suspend or terminate accounts</ListItem>
                </ul>
                <Para className="mt-2">We are not obligated to monitor all content but may do so to maintain platform safety.</Para>
            </section>

            <section className="mt-7">
                <Head2>9. Account Suspension and Termination</Head2>
                <Para>We may suspend or terminate accounts if users:</Para>
                <ul className="mt-2">
                    <ListItem>Violate these Terms</ListItem>
                    <ListItem>Upload prohibited content</ListItem>
                    <ListItem>Abuse or exploit the platform</ListItem>
                    <ListItem>Repeatedly infringe copyright</ListItem>
                </ul>
                <Para className="mt-2">We may terminate accounts without prior notice when necessary.</Para>
                <Para className="mt-2">Users may delete their accounts at any time.</Para>
            </section>

            <section className="mt-7">
                <Head2>10. Sharing and Public Links</Head2>
                <Para>Sound clips and soundboards may be shared publicly via links.</Para>
                <Para className="mt-2">By uploading content, you acknowledge that:</Para>
                <ul className="mt-2">
                    <ListItem>Your content may be publicly accessible</ListItem>
                    <ListItem>Others may listen to, embed and share your content</ListItem>
                </ul>
            </section>
            <section className="mt-7">
                <Head2>11. Third-Party Services</Head2>
                <Para>Sound Effect Pro uses third-party authentication and services.</Para>
                <Para className="mt-2">Your use of these services is also subject to their respective terms and policies.</Para>
                <Para className="mt-2">We are not responsible for third-party services.</Para>
            </section>
            <section className="mt-7">
                <Head2>12. Limitation of Liability</Head2>
                <Para>To the maximum extent permitted by law:</Para>
                <Para className="mt-2">Sound Effect Pro is provided “as is” and “as available.”</Para>
                <Para className="mt-2">We do not guarantee:</Para>
                <ul className="mt-2">
                    <ListItem>Continuous availability</ListItem>
                    <ListItem>Error-free operation</ListItem>
                    <ListItem>Security from all threats</ListItem>
                    <ListItem>Accuracy of user-generated content</ListItem>
                </ul>
                <Para className="mt-2">We are not liable for:</Para>
                <ul className="mt-2">
                    <ListItem>Loss of data</ListItem>
                    <ListItem>Loss of profits or revenue</ListItem>
                    <ListItem>Business interruption</ListItem>
                    <ListItem>Indirect or consequential damages</ListItem>
                </ul>
                <Para className="mt-2">Your use of the platform is at your own risk.</Para>
            </section>
            <section className="mt-7">
                <Head2>13. Disclaimer</Head2>
                <Para>Sound Effect Pro hosts user-generated content.</Para>
                <Para className='mt-2'>We do not endorse or verify the accuracy, legality, or reliability of uploaded content.</Para>
                <Para className="mt-2">Users are solely responsible for content they upload or share.</Para>
            </section>
            <section className="mt-7">
                <Head2>14. Indemnification</Head2>
                <Para>You agree to indemnify and hold SoundEffect Pro harmless from any claims, damages, or legal disputes arising from:</Para>
                <ul className="mt-2">
                    <ListItem>Your content</ListItem>
                    <ListItem>Your misuse of the platform</ListItem>
                    <ListItem>Your violation of these Terms</ListItem>
                </ul>
            </section>
            <section className="mt-7">
                <Head2>15. Changes to the Service</Head2>
                <Para>We may:</Para>
                <ul className="mt-2">
                    <ListItem>Modify or discontinue features</ListItem>
                    <ListItem>Update these Terms</ListItem>
                    <ListItem>Restrict access to parts of the platform</ListItem>
                </ul>
                <Para className="mt-2">Continued use means acceptance of updated Terms.</Para>
            </section>
            <section className="mt-7">
                <Head2>16. Governing Law and Jurisdiction</Head2>
                <Para>These Terms are governed by international laws and principles, with primary consideration to:</Para>
                <ul className="mt-2">
                    <ListItem>United States laws</ListItem>
                    <ListItem>European Union regulations</ListItem>
                </ul>
                <Para className="mt-2">Any disputes shall be resolved in a competent jurisdiction chosen by SoundEffect Pro, in accordance with applicable international laws.</Para>
            </section>
            <section className="mt-7">
                <Head2>17. Contact Information</Head2>
                <Para>For legal inquiries or questions, <Link href="/contact" className='text-blue-500 dark:text-blue-400 hover:underline'>contact us</Link> :</Para>
                <div className='mt-2 max-w-sm'>
                    <InfoRow icon={GlobeAltIcon} label='Website' value='Sound Effect Pro' />
                    <InfoRow icon={EnvelopeIcon} label='Email' value={process.env.NEXT_PUBLIC_SUPPORT_EMAIL!} />
                </div>
                <Para className="mt-2">We aim to respond within a reasonable timeframe.</Para>
            </section>
            <GoogleAd
                slot="7619276466"
                format="autorelaxed"
                variant="multiplex"
            />
        </>
    )
}

export default Terms
