import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
    return (
        <Html>
            <Head >
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3057716180157458"
                    crossOrigin="anonymous"></script>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-6RV1HQYTBK" strategy='afterInteractive' />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'GA_MEASUREMENT_ID');
                    `}
                </Script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}