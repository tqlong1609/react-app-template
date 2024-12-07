import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body className={` sidebar-mini layout-fixed sidebar-collapse`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
