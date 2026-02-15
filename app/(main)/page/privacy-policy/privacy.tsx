'use client'
import { Head1, Para, Head2, Head3, ListItem } from '@/app/components/Ui'
import InfoRow from '@/app/components/InfoRow'
import { CalendarDateRangeIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import GoogleAd from '@/app/components/ad';

function Privacy() {
  return (
    <>
      <Head1>
        Privacy Policy – Sound Effect Pro
      </Head1>
      <div className='max-w-sm'>
        <InfoRow icon={CalendarDateRangeIcon} label='Effective Date' value='05 February, 2026' />
        <InfoRow icon={CalendarDateRangeIcon} label='Last Update' value='05 February, 2026' />
      </div>
      <section className='mt-7'>
        <Para>
          Welcome to <Link href='/' className='text-blue-500 dark:text-blue-400 hover:underline'>Sound Effect Pro</Link> (“we”, “our”, “us”). Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.
          <br></br>
          By accessing or using Sound Effect Pro, you agree to the terms of this Privacy Policy.
        </Para>
      </section>
      <section className="mt-7">
        <Head2>1. Information We Collect</Head2>
        <Para>We collect information to provide better services and improve user experience.</Para>
        <br></br>
        <Head3>1.1 Information You Provide Directly</Head3>
        <Para>When you create an account or use our platform, we may collect:</Para>
        <ul className='mt-2'>
          <ListItem>Name or username</ListItem>
          <ListItem>Email address</ListItem>
          <ListItem>Profile picture (if provided via OAuth)</ListItem>
          <ListItem>Uploaded sound clips and metadata (title, tags, description)</ListItem>
          <ListItem>Account preferences</ListItem>
          <ListItem>Messages sent to support</ListItem>
        </ul>
        <br></br>
        <Head3>1.2 Authentication Information</Head3>
        <Para>If you sign in using third-party services, we receive limited profile data:</Para>
        <ul className='mt-2'>
          <ListItem>Google OAuth (name, email, profile image)</ListItem>
          <ListItem>Discord OAuth (username, email, avatar)</ListItem>
          <ListItem>Twitch OAuth (username, email, profile image)</ListItem>
          <ListItem>Magic Link Login (email address only)</ListItem>
        </ul>
        <Para className='mt-2'>We do not access your passwords from third-party providers.</Para>
        <br></br>
        <Head3>1.3 Automatically Collected Data</Head3>
        <Para>We may collect:</Para>
        <ul className='mt-2'>
          <ListItem>IP address</ListItem>
          <ListItem>Browser type</ListItem>
          <ListItem>Device information</ListItem>
          <ListItem>Pages visited</ListItem>
          <ListItem>Usage activity</ListItem>
          <ListItem>Referring URLs</ListItem>
        </ul>
        <Para className="mt-2">This data is collected through cookies and analytics tools.</Para>
      </section>
      <section className="mt-7">
        <Head2>2. How We Use Your Data</Head2>
        <Para>We use collected information to:</Para>
        <ul className="mt-2">
          <ListItem>Create and manage user accounts</ListItem>
          <ListItem>Enable content uploads and sharing</ListItem>
          <ListItem>Provide authentication and login services</ListItem>
          <ListItem>Improve website performance and features</ListItem>
          <ListItem>Prevent fraud and misuse</ListItem>
          <ListItem>Communicate important service updates</ListItem>
          <ListItem>Respond to support requests</ListItem>
          <ListItem>Comply with legal obligations</ListItem>
        </ul>
        <Para className="mt-2">We do not sell personal data to third parties.</Para>
      </section>
      <section className="mt-7">
        <Head2>3.Cookies and Tracking Technologies</Head2>
        <Para>Sound Effect Pro uses cookies to:</Para>
        <ul className="mt-2">
          <ListItem>Maintain login sessions</ListItem>
          <ListItem>Remember user preferences</ListItem>
          <ListItem>Improve performance</ListItem>
          <ListItem>Analyze traffic and usage patterns</ListItem>
        </ul>
        <br></br>
        <Head3>Types of Cookies Used</Head3>
        <ul className="mt-2">
          <ListItem>Essential cookies (required for site functionality)</ListItem>
          <ListItem>Performance cookies (analytics)</ListItem>
          <ListItem>Preference cookies</ListItem>
        </ul>
        <Para className="mt-2">You may control cookies through your browser settings. Disabling cookies may affect some features.</Para>
      </section>
      <section className='mt-7'>
        <Head2>4. Third-Party Services</Head2>
        <Para>We use trusted third-party services for ads, authentication, hosting, analytics, and email delivery.</Para>
        <Para className='mt-2'>These may include:</Para>
        <ul className="mt-2">
          <ListItem>Google OAuth</ListItem>
          <ListItem>Discord OAuth</ListItem>
          <ListItem>Twitch OAuth</ListItem>
          <ListItem>Email service providers, currently Resend (for magic links and notifications)</ListItem>
          <ListItem>Analytics tools</ListItem>
          <ListItem>Cloud hosting providers</ListItem>
          <ListItem>Google Ads</ListItem>
        </ul>
        <Para className="mt-2">Each third-party service follows its own privacy policy. We only share necessary data required to provide functionality.</Para>
      </section>
      <section className="mt-7">
        <Head2>5. User-Generated Content</Head2>
        <Para>When you upload sound clips:</Para>
        <ul className="mt-2">
          <ListItem>Content becomes publicly accessible unless deleted</ListItem>
          <ListItem>You retain ownership of your uploads</ListItem>
          <ListItem>You grant Sound Effect Pro a limited license to display and distribute your content on the platform</ListItem>
        </ul>
        <Para className="mt-2">You are responsible for ensuring uploaded content does not violate copyright or platform rules.</Para>
      </section>
      <section className="mt-7">
        <Head2>6. Account Deletion and Data Removal</Head2>
        <Para>You have full control over your account.</Para>
        <Para className="mt-2">You may:</Para>
        <ul className="mt-2">
          <ListItem>Delete uploaded content at any time</ListItem>
          <ListItem>Permanently delete your account</ListItem>
        </ul>
        <Para className="mt-2">Upon deletion:</Para>
        <ul className="mt-2">
          <ListItem>Your profile data is removed</ListItem>
          <ListItem>Uploaded content is deleted</ListItem>
          <ListItem>Authentication records are erased</ListItem>
          <ListItem>Residual backups may remain temporarily for legal or security reasons</ListItem>
        </ul>
        <Para className="mt-2">Deletion requests are processed promptly.</Para>
      </section>
      <section className="mt-7">
        <Head2>7. User Rights (GDPR Compliance)</Head2>
        <Para>As a user, you have the right to:</Para>
        <ul className="mt-2">
          <ListItem>Access your personal data</ListItem>
          <ListItem>Correct inaccurate information</ListItem>
          <ListItem>Request data deletion ("Right to be Forgotten")</ListItem>
          <ListItem>Restrict or object to processing</ListItem>
          <ListItem>Download your data (data portability)</ListItem>
          <ListItem>Withdraw consent at any time</ListItem>
        </ul>
        <Para className="mt-2">To exercise these rights, contact us using the details below.</Para>
      </section>
      <section className="mt-7">
        <Head2>8. Data Security</Head2>
        <Para>We implement industry-standard security measures including:</Para>
        <ul className="mt-2">
          <ListItem>HTTPS encryption</ListItem>
          <ListItem>Secure authentication methods</ListItem>
          <ListItem>Access controls</ListItem>
          <ListItem>Regular monitoring</ListItem>
          <ListItem>Secure hosting infrastructure</ListItem>
        </ul>
        <Para className="mt-2">While we take strong precautions, no system is 100% secure. We encourage users to protect account credentials.</Para>
      </section>
      <section className="mt-7">
        <Head2>9. Data Retention</Head2>
        <Para>We retain personal data only as long as necessary:</Para>
        <ul className="mt-2">
          <ListItem>While your account is active</ListItem>
          <ListItem>To comply with legal requirements</ListItem>
          <ListItem>For legitimate business purposes</ListItem>
        </ul>
        <Para className="mt-2">After deletion, data is permanently removed within a reasonable timeframe.</Para>
      </section>
      <section className="mt-7">
        <Head2>10. Children’s Privacy (13+)</Head2>
        <Para>Sound Effect Pro is not intended for children under 13 years of age.</Para>

        <Para className="mt-2">We do not knowingly collect personal data from children under 13. If you believe a child has provided personal information, please contact us immediately for removal.</Para>
      </section>
      <section className="mt-7">
        <Head2>11. International Data Transfers</Head2>
        <Para>Your data may be processed or stored on servers located outside your Country. We ensure adequate data protection safeguards in accordance with GDPR and your country IT laws</Para>
      </section>
      <section className="mt-7">
        <Head2>12. Legal Compliance (GDPR)</Head2>
        <Para>Sound Effect Pro complies with:</Para>
        <ul className="mt-2">
          <ListItem>GDPR (General Data Protection Regulation – EU)</ListItem>
          <ListItem>Applicable data protection regulations</ListItem>
        </ul>
        <Para className="mt-2">We process personal data lawfully, transparently, and fairly.</Para>
      </section>
      <section className="mt-7">
        <Head2>13. Changes to This Policy</Head2>
        <Para>We may update this Privacy Policy from time to time.</Para>
        <Para className='mt-2'>When changes occur:</Para>
        <ul className="mt-2">
          <ListItem>Updated date will be shown</ListItem>
          <ListItem>Continued use of the platform indicates acceptance</ListItem>
        </ul>
        <Para className="mt-2">We recommend reviewing this page periodically.</Para>
      </section>
      <section className="mt-7">
        <Head2>14. Contact Information</Head2>
        <Para>If you have questions, concerns, or privacy requests, <Link href="/contact" className='text-blue-500 dark:text-blue-400 hover:underline'>contact us</Link> :</Para>
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

export default Privacy
