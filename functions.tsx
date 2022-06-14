export const MetaTags = ({ title, description, image }: any) => {
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

export const setSong = async (video: string) => {
    const audioE = document.querySelector('audio') as HTMLAudioElement
    audioE.src = `${document.location.origin}/api/stream?v=${video}`
    const detailsE = document.querySelector('#songDetails') as HTMLDivElement
    const details: any = await (await fetch(`${document.location.origin}/api/details?v=${video}`)).json()
    detailsE.querySelector('h1')!.innerText = details.videoDetails.title
    detailsE.querySelector('h2')!.innerText = details.videoDetails.author.name
    detailsE.querySelector('div')!.innerText = video
    detailsE.querySelector('span')!.innerText = details.videoDetails?.thumbnails[details.videoDetails.thumbnails.length - 1].url
    detailsE.querySelector('p')!.innerText = details.videoDetails?.description
    detailsE.querySelector('section')!.innerText = JSON.stringify(details)
}