import type { NextPage } from "next";
import { Head, NextScript, Main, Html } from "next/document";
import theme from "../components/theme";

const Document: NextPage = () => {
    return (<Html lang="en">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel='apple-touch-icon' href='/apple_touch_icon.png' />
            <link rel='icon' type="image/x-icon" href='/rect.ico' />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Inconsolata&family=Sora&display=swap" rel="stylesheet" />
            <link rel="manifest" href="/api/manifest.webmanifest" />
            <meta name="theme-color" content={theme.colors[theme.primaryColor][theme.primaryShade]} />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>)
}

export default Document