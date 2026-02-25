import './globals.css'

export const metadata = {
  title: '印刷厂管理平台',
  description: 'ConferencePub 印刷厂管理平台',
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
