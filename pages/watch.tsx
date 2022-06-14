import { AspectRatio, LoadingOverlay, Text, Image } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MetaTags, setSong } from '../functions'

const Watch: NextPage = () => {
    const router = useRouter()
    const [details, setDetails] = useState<any>()

    useEffect(() => {
        if (typeof window !== 'undefined' && !details) {
            setDetails({
                'thumbnail': document?.querySelector("#songDetails span")?.innerHTML,
                'title': document?.querySelector("#songDetails h1")!.innerHTML,
                'author': document?.querySelector("#songDetails h2")!.innerHTML,
                'description': document.querySelector("#songDetails p")!.innerHTML.replace(/<br>/g, '\n'),
            })
        }
    }, [details])

    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })

    if (typeof window !== 'undefined') {
        router.prefetch('/player')
        const id = (new URLSearchParams(location.search)).get('v')
        if (id) { setSong(id!, currentLQ); router.push('/player') }
    }

    const Details = () => {
        return (
            <>
                <MetaTags image={details?.thumbnail} title={`${details?.title} | Ossia`} description={`Listen to ${details?.title} by ${details?.author} on the Ossia Music Player!`} />
                <AspectRatio mb='sm' ratio={1280 / 720}>
                    <Image alt='a' src={details?.thumbnail} />
                </AspectRatio>
                <Text dangerouslySetInnerHTML={{ __html: details?.title }} size='xl' />
                <Text dangerouslySetInnerHTML={{ __html: details?.author }} size='sm' />
                <Text sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: details?.description }} />
            </>
        )
    }

    return (
        <>
            <Details />
        </>
    )
}

export default Watch