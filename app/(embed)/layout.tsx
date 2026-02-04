import '../globals.css' // If you need styles
import Providers from './provider'

export const metadata = {
  title: 'Sound Effect Pro Embed',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}