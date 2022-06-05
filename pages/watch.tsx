import { ActionIcon, Box, Container, Divider, Group, Image, InputWrapper, LoadingOverlay, Progress, SimpleGrid, Slider, Text, Title } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next'
import Link from 'next/link';
import { createElement, useEffect, useRef, useState } from 'react';
import { PlayerPause, PlayerPlay, VolumeOff, Volume } from 'tabler-icons-react';

const Player: NextPage = () => {
    const [id, setID]: any = useState("")
    const [paused, setPaused] = useState(true)
    const [details, setDetails]: any = useState(false)
    const [loading, setLoading] = useState(true)
    const [volume, setVolume] = useState(100)
    const [prevVol, setPrevVol] = useState(100)
    if (typeof window !== 'undefined' && !id) {
        setID((new URLSearchParams(window.location.search).get('v')))
    }

    useHotkeys([["ctrl+M", () => {
        if (volume == 0) {
            showNotification({
                'icon': <Volume />,
                'title': 'Unmuted',
                'message': '',
                'id': 'unmute'
            })
            setVolume(prevVol)
        } else {
            showNotification({
                'icon': <VolumeOff />,
                'title': 'Muted',
                'message': '',
                'id': 'mute'
            })
            setPrevVol(volume)
            setVolume(0)
        }
    }],
    ['space', () => { setPaused(!paused) }],])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (document.getElementsByTagName('audio')[0].src) { return }
            document.getElementsByTagName('audio')[0].src = `${document.location.origin}/api/stream?v=${id}`
        }

        if (typeof window !== 'undefined' && !details) {
            fetch(`${document.location.origin}/api/details?v=${id}`).then(async resp => { setDetails(await resp.json()) })
        }
    }, [id, details])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const player = document.getElementsByTagName('audio')[0]
            if (paused) {
                player.pause()
            } else {
                player.play()
            }
        }
    }, [paused])

    const Player = () => {
        if (!details) { return <></> }
        return (
            <Group direction='column' position='center'>
                <Box sx={{ marginTop: '-3%', position: 'relative', borderRadius: '25%', clipPath: 'circle(30%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image draggable='false' sx={{ filter: 'brightness(0.7)', width: '100vmin' }} alt={details.videoDetails?.title} width='100%' src={details.videoDetails?.thumbnails[details.videoDetails.thumbnails.length - 1].url} />
                    <Box sx={{ position: 'absolute', zIndex: 99, justifyContent: 'center' }}>
                        <ActionIcon variant='outline' size='xl' onClick={() => { setPaused(!paused) }}>
                            {paused ? <PlayerPlay /> : <PlayerPause />}
                        </ActionIcon>
                    </Box>
                </Box>
            </Group>
        )
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.getElementsByTagName('audio')[0].volume = volume / 100
        }
    }, [volume])

    return (
        <Container p='sm'>
            <LoadingOverlay visible={loading} />
            <Title mb='sm' align='center'><Link href='/'>Ossia</Link></Title>
            <audio onLoadedData={() => { setLoading(false) }} style={{ 'display': 'none' }} />
            <Player />
            <div style={{ margin: '0 10vw' }}>
                <Text mb={5} size='xl'>{details.videoDetails?.title}</Text>
                <Text size='sm'>{details.videoDetails?.author.name}</Text>
                <Divider my='md' />
                <InputWrapper label="Volume">
                    <Slider value={volume} onChange={setVolume} marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                    ]} />
                </InputWrapper>
            </div>
        </Container>
    )
}

export default Player;