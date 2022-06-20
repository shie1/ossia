/* eslint-disable @next/next/no-title-in-document-head */
/* eslint-disable @next/next/next-script-for-ga */
import { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from "../lib/gtag";

const isProduction = process.env.NODE_ENV === "production";

export default function Document() {
    return (
        <Html lang='en'>
            <Head >
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                {isProduction && (
                    <>
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3057716180157458"
                            crossOrigin="anonymous"></script>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                        />
                        <script
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${GA_TRACKING_ID}', {
                                    page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="manifest" href="/api/manifest.webmanifest" />
                <link rel='apple-touch-icon' href='/apple_touch_icon.png' />
                <link rel='icon' type="image/x-icon" href='/rect.ico' />
                <meta name="theme-color" content="#9E5DB9" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <body>
                <title>Ossia</title>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}