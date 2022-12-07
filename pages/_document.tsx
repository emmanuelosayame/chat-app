import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <body
        style={{
          position: "fixed",
          right: 0,
          left: 0,
          top: 0,
          WebkitTapHighlightColor: "rgba(0,0,0,0)",
        }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
