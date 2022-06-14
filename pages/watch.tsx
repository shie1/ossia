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
            fetch(`${document.location.origin}/api/details?v=${id}${currentLQ ? '&q=lowestaudio' : ''}`).then(async (resp:any) => {
                setDetails(await resp.json())
            })
        }
    }, [details,currentLQ,router])

    if (typeof window !== 'undefined') {
        router.prefetch('/player')

    }

    const Details = () => {
        return (
            <>
                <MetaTags image={details?.thumbnail} title={`${details?.title} | Ossia`} description={`Listen to ${details?.title} by ${details?.author} on the Ossia Music Player!`} />
                <AspectRatio mb='sm' ratio={1280 / 720}>
                    <Image alt='' src={details?.thumbnail} />
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