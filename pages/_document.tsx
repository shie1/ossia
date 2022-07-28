import type { NextPage } from "next";
import { Head, NextScript, Main, Html } from "next/document";
import { useMantineTheme } from "@mantine/core";

const Document: NextPage = () => {
    const theme = useMantineTheme()
    return (<Html lang="en">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel='apple-touch-icon' href='/api/ossia_rect.png?s=192' />
            <link rel='icon' type="image/x-icon" href='/circle.ico' />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Inconsolata&family=Sora&display=swap" rel="stylesheet" />
            <link rel="manifest" href="/api/manifest.webmanifest" />
            <meta name="theme-color" content={theme.colors[theme.primaryColor][theme.primaryShade as any]} />

            <meta name="title" content="Ossia Music Player" />
            <meta name="description" content="The Ossia Music Player is a free, open source alternative to YouTube Music." />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://ossia.rocks" />
            <meta property="og:title" content="Ossia Music Player" />
            <meta property="og:description" content="The Ossia Music Player is a free, open source alternative to YouTube Music." />
            <meta property="og:image" content="/api/img/music_without_limits.png" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://ossia.rocks" />
            <meta property="twitter:title" content="Ossia Music Player" />
            <meta property="twitter:description" content="The Ossia Music Player is a free, open source alternative to YouTube Music." />
            <meta property="twitter:image" content="/api/img/music_without_limits.png" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>)
}

export default Document