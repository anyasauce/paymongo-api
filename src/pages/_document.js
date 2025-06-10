// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/*
          IMPORTANT: Replace "https://js.paymongo.com/v1/paymongo.js"
          with the actual CDN URL from PayMongo's latest documentation.
        */}
        <script src="https://js.paymongo.com/v1/paymongo.js" async defer></script>
      </body>
    </Html>
  );
}