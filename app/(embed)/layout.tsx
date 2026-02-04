import '../globals.css' // If you need styles

export const metadata = {
  title: 'SFX Embed',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  )
}