const MetaTags = ({title, description, image}) => {
    const Image = () => {
        if(!image){return <div />}
        return (
            <meta property="og:image" content={image} />
            <meta name="twitter:image" content={image} />
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
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="ossia.ml" />
            <meta property="twitter:url" content="https://ossia.ml/" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            
            <Image />
        </>
        )
}

export MetaTags;