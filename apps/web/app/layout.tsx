import './globals.css'

export const metadata = {
  title: '会刊出版平台',
  description: '在线会刊出版SaaS平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
