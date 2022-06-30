import type { NextPage } from "next";
import { Head, NextScript, Main, Html } from "next/document";

const Document: NextPage = () => {
    return (<Html lang="en">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel='apple-touch-icon' href='/apple_touch_icon.png' />
            <link rel='icon' type="image/x-icon" href='/rect.ico' />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>)
}

export default Document