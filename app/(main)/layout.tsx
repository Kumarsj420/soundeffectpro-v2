import type { Metadata } from "next";
import Providers from "../providers";
import "../globals.css";
import { Nunito } from 'next/font/google'
import Navbar from "../components/Navbar";
import Modal_Root from "../components/modals/Modal_Root";
import FetchLoading from "../components/fetchLoading";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleAd from "../components/ad"
import Script from 'next/script'
import AnalyticsTracker from "../components/AnalyticsTracker";
import BottomMenu from "../components/BottomMenu";

export const metadata: Metadata = {
  title: "Sound Effect Pro | Download Unlimited Free Sound Effects | Trending Sound Buttons",
  description: "Spice up your social media posts and videos with our collection of 50k+ sound effects. Download, share, and embed hilarious meme sound buttons for free!",
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`dark ${nunito.className}`}>
      <head>
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
          crossOrigin="anonymous"></script>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
      </head>
      <body
        className={` antialiased bg-gray-100 text-gray-900 dark:bg-zinc-950 dark:text-white`}
      >
        <Providers>
          <Navbar />
          <BottomMenu />
          <GoogleAd slot="4761169093" variant="sidebar" />
          <GoogleAd slot='3089004514' variant="header" />

          <Modal_Root />
          <FetchLoading />
          <AnalyticsTracker />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            theme="colored"
            draggable
            pauseOnHover
          />
          <div className="max-w-7xl 2xl:max-w-450 m-auto px-5 sm:px-7 py-5 sm:py-7">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
