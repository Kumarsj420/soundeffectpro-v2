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
      </head>
      <body
        className={` antialiased bg-gray-100 text-gray-900 dark:bg-zinc-950 dark:text-white`}
      >
        <div className="w-full bg-linear-to-r from-sky-500 to-indigo-600  ">
          <p className="max-w-7xl m-auto px-5 sm:px-7 py-1.5 text-sm/5 text-white">
            We&apos;re rolling out updates. You may experience limited functionality during this time.
          </p>
        </div>
        <Providers>
          <Navbar />
          <div className="max-w-7xl m-auto px-5 sm:px-7">
            <GoogleAd slot='3080916601' />
          </div>
          <Modal_Root />
          <FetchLoading />
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
          <div className="max-w-7xl m-auto px-5 sm:px-7 py-5 sm:py-7">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
