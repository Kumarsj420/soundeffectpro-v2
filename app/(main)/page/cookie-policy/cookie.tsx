'use client'
import { Head1, Para, Head2, Head3, ListItem } from '@/app/components/Ui'
import InfoRow from '@/app/components/InfoRow'
import { CalendarDateRangeIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import GoogleAd from '@/app/components/ad';

function Cookie() {
    return (
        <>
            <Head1>
                Cookie Policy – Sound Effect Pro
            </Head1>
            <div className='max-w-sm'>
                <InfoRow icon={CalendarDateRangeIcon} label='Effective Date' value='05 February, 2026' />
                <InfoRow icon={CalendarDateRangeIcon} label='Last Update' value='05 February, 2026' />
            </div>
            <section className='mt-7'>
                <Para>This Cookie Policy explains how <Link href='/' className='text-blue-500 dark:text-blue-400 hover:underline'>Sound Effect Pro</Link> uses cookies and similar technologies when you visit our website.
                </Para>
                <Para className="mt-2">By continuing to use our site, you agree to the use of cookies as described in this policy.</Para>
            </section>
            <section className="mt-7">
                <Head2>1. What Are Cookies?</Head2>
                <Para>
                    Cookies are small text files stored on your device (computer, tablet, or phone) when you visit a website.
                </Para>

                <Para className='mt-2'>They help websites:</Para>
                <ul className='mt-2'>
                    <ListItem>Remember your preferences</ListItem>
                    <ListItem>Keep you logged in</ListItem>
                    <ListItem>Understand how the site is used</ListItem>
                    <ListItem>Show relevant ads</ListItem>
                </ul>
                <Para className="mt-2">
                    Cookies do not give us access to your device or personal files.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>2. Why We Use Cookies</Head2>
                <Para>We use cookies to make Sound Effect Pro work properly and improve your experience.</Para>

                <Para className="mt-2">Cookies help us:</Para>
                <ul className='mt-2'>
                    <ListItem>Keep you logged in</ListItem>
                    <ListItem>Save your preferences</ListItem>
                    <ListItem>Understand how users interact with the site</ListItem>
                    <ListItem>Improve performance and features</ListItem>
                    <ListItem>Display relevant advertisements</ListItem>
                </ul>
                <Para className="mt-2">
                    Some cookies are essential for the website to function.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>3. Types of Cookies We Use</Head2>

                <Head3 className='mt-2'>3.1 Essential Cookies (Required)</Head3>
                <Para className="mt-2">These cookies are necessary for the website to function.</Para>
                <Para className="mt-2">They enable features such as:</Para>
                <ul className="mt-2">
                    <ListItem>Account login and authentication</ListItem>
                    <ListItem>Session management</ListItem>
                    <ListItem>Security protection</ListItem>
                    <ListItem>Remembering user settings</ListItem>
                </ul>
                <Para className="mt-2">Without these cookies, the website may not work properly.</Para>
                <br></br>
                <Head3>3.2 Login and Session Cookies</Head3>
                <Para className="mt-2">When you sign in using:</Para>
                <ul className="mt-2">
                    <ListItem>Google</ListItem>
                    <ListItem>Discord</ListItem>
                    <ListItem>Twitch</ListItem>
                    <ListItem>Magic email login</ListItem>
                </ul>
                <Para className="mt-2">
                    We use session cookies to:
                </Para>
                <ul className="mt-2">
                    <ListItem>Keep you logged in</ListItem>
                    <ListItem>Protect your account</ListItem>
                    <ListItem>Maintain secure sessions</ListItem>
                </ul>
                <Para className="mt-2">These cookies are automatically deleted when you log out or close your browser.</Para>
                <br></br>
                <Head3>3.3 Analytics Cookies</Head3>
                <Para>We use analytics tools to understand how visitors use SoundEffect Pro.</Para>
                <Para className="mt-2">
                    These cookies help us learn:
                </Para>
                <ul className="mt-2">
                    <ListItem>Which pages are popular</ListItem>
                    <ListItem>How users navigate the site</ListItem>
                    <ListItem>How we can improve performance</ListItem>
                </ul>
                <Para className="mt-2">
                    Analytics data is aggregated and anonymous and does not directly identify you.
                </Para>
                <br></br>
                <Head3>3.4 Advertising Cookies (Google AdSense)</Head3>
                <Para>SoundEffect Pro uses Google AdSense to display ads.</Para>
                <Para className="mt-2">
                    Google and its partners may use cookies to:
                </Para>
                <ul className="mt-2">
                    <ListItem>Show relevant ads based on your interests</ListItem>
                    <ListItem>Limit how often you see the same ad</ListItem>
                    <ListItem>Measure ad performance</ListItem>
                </ul>
                <Para className="mt-2">
                    These cookies may track browsing activity across different websites.
                </Para>
                <Para className="mt-2">You can learn more here: <a href='https://policies.google.com/technologies/ads' className='text-blue-500 dark:text-blue-400 hover:underline' target='_blank'>https://policies.google.com/technologies/ads</a></Para>
                <br></br>
                <Head3>3.5 Third-Party Cookies</Head3>
                <Para className="mt-2">
                    Some cookies are set by third-party services we use, including:
                </Para>
                <ul className="mt-2">
                    <ListItem>OAuth login providers (Google, Discord, Twitch)</ListItem>
                    <ListItem>Analytics providers</ListItem>
                    <ListItem>Advertising partners (Google AdSense)</ListItem>
                </ul>
                <Para className="mt-2">
                    These providers may collect information according to their own privacy policies.
                </Para>
            </section>
            <section className='mt-7'>
                <Head2>4. How You Can Control Cookies</Head2>
                <Para>You have full control over cookies. </Para>
                <br></br>
                <Head3>
                    Browser Settings
                </Head3>
                <Para className="mt-2">
                    Most browsers allow you to:
                </Para>
                <ul className="mt-2">
                    <ListItem>View stored cookies</ListItem>
                    <ListItem>Delete cookies</ListItem>
                    <ListItem>Block cookies completely</ListItem>
                    <ListItem>Block third-party cookies</ListItem>
                </ul>
                <Para className="mt-2">
                    Check your browser help section for instructions.
                </Para>
                <br></br>
                <Head3>
                    Google Ads Personalization
                </Head3>
                <Para className="mt-2">
                    You can manage ad personalization here: <a href='https://adssettings.google.com' className='text-blue-500 dark:text-blue-400 hover:underline' target='_blank'>https://adssettings.google.com</a>
                </Para>
                <br></br>
                <Head3>
                    Cookie Banner
                </Head3>
                <Para className="mt-2">
                    Where required by law, we provide a cookie consent banner allowing you to accept or manage cookies.
                </Para>
            </section>
            <section className="mt-7">
                <Head2>5. What Happens If You Disable Cookies</Head2>
                <Para>You can still use the website, but some features may not work correctly, including:</Para>
                <ul className="mt-2">
                    <ListItem>Login sessions</ListItem>
                    <ListItem>Saved preferences</ListItem>
                    <ListItem>Personalized experience</ListItem>
                </ul>
            </section>
            <section className="mt-7">
                <Head2>6. Updates to This Policy</Head2>
                <Para>
                    We may update this Cookie Policy from time to time.
                </Para>
                <Para className="mt-2">
                    Updates will be posted on this page with a new revision date.
                </Para>
            </section>

            <section className="mt-7">
                <Head2>10. Contact Information</Head2>
                <Para>If you have questions about our Cookie Policy: <Link href="/contact" className='text-blue-500 dark:text-blue-400 hover:underline'>contact us</Link> :</Para>
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

export default Cookie
