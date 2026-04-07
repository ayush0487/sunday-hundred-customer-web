import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="Ac1Tkj649VTaCd4NNsGlZJaWB44gSrD4QzS8Tzvy9rA"
        />
        <meta name="application-name" content="Sunday Hundred" />
        <meta name="apple-mobile-web-app-title" content="Sunday Hundred" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
