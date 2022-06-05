import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head >
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3057716180157458"
                    crossOrigin="anonymous"></script>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-6RV1HQYTBK"></script>
                <script async src='/gtag-stuff.js' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}