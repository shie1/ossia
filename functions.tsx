import { unescape } from 'querystring'
import md5 from 'md5'

export const MetaTags = ({ title, description, image }: any) => {
    if (!title) { return <></> }
    const ImageTags = () => {
        if (!image) { return <div /> }
        return (
            <>
                <meta property="og:image" content={image} />
                <meta name="twitter:image" content={image} />
            </>
        )
    }

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:url" content="https://ossia.ml/" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            <meta name='application-name' content={title} />
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='apple-mobile-web-app-status-bar-style' content='default' />
            <meta name='apple-mobile-web-app-title' content={title} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="ossia.ml" />
            <meta property="twitter:url" content="https://ossia.ml/" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            <ImageTags />
        </>
    )
}

export const setSong = async (video: string, lq: boolean) => {
    const audioE = document.querySelector('audio') as HTMLAudioElement
    const detailsE = document.querySelector('#songDetails') as HTMLDivElement
    if (video == detailsE.querySelector('div')?.innerText) { return }
    audioE.src = `${document.location.origin}/api/stream?v=${video}`
    const details: any = await (await fetch(`${document.location.origin}/api/details?v=${video}${lq ? '&q=lowestaudio' : ''}`)).json()
    detailsE.querySelector('h1')!.innerText = details.videoDetails.title
    detailsE.querySelector('h2')!.innerText = details.videoDetails.author.name
    detailsE.querySelector('div')!.innerText = video
    detailsE.querySelector('span')!.innerText = details.videoDetails?.thumbnails[lq ? 0 : details.videoDetails.thumbnails.length - 1].url
    detailsE.querySelector('p')!.innerText = details.videoDetails?.description
    detailsE.querySelector('section')!.innerText = JSON.stringify(details)
}

export const apiroot = "http://ws.audioscrobbler.com/2.0/"

export const genSig = (json: any, env: any) => {
    let sig = ""
    const keys = Object.keys(json)
    keys.sort()
    for (const item of keys) {
        sig = sig + item + json[item]
    }
    json['api_sig'] = md5(unescape(encodeURIComponent(sig + env.LASTFM_SECRET)))
    return json
}

export const htmlDecode = (input: any) => {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}