import { AspectRatio, LoadingOverlay, Text, Image } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MetaTags, setSong } from '../functions'

const Watch: NextPage = () => {
    const router = useRouter()
    const [details, setDetails] = useState<any>()

    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })

    useEffect(() => {
        if (typeof window !== 'undefined' && !details) {
            const id = (new URLSearchParams(location.search)).get('v')
            if (id) { setSong(id!, currentLQ); router.push('/player') }
            fetch(`${document.location.origin}/api/details?v=${id}${currentLQ ? '&q=lowestaudio' : ''}`).then(async (resp: any) => {
                setDetails(await resp.json())
            })
        }
    }, [details, currentLQ, router])

    useEffect(() => {
        if (details) {
            const title = `${details.videoDetails.title} | Ossia`
            const description = `Listen to ${details.videoDetails.title} by ${details.videoDetails.author.name}`
            const image = details.videoDetails?.thumbnails[details.videoDetails.thumbnails.length - 1].url

            document.querySelector("title")!.innerHTML = title
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)

            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
            document.querySelector('meta[name="description"]')?.setAttribute('content', description)

            document.querySelector('meta[property="og:image"]')?.setAttribute('content', image)
            document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image)
        }
    }, [details])

    const Details = () => {
        return (
            <>
                <AspectRatio mb='sm' ratio={1280 / 720}>
                    <Image alt='' src={details?.thumbnail} />
                </AspectRatio>
                <Text dangerouslySetInnerHTML={{ __html: details?.title }} size='xl' />
                <Text dangerouslySetInnerHTML={{ __html: details?.author }} size='sm' />
                <Text sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: details?.description }} />            </>
        )
    }

    return (
        <>
            <Details />
        </>
    )
}

export default Watch