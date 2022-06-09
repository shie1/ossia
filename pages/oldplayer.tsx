import { ActionIcon, Box, Container, Divider, Group, Image, InputWrapper, LoadingOverlay, Progress, SimpleGrid, Slider, Text, Title, Button, Space } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next'
import Link from 'next/link';
import { createElement, useEffect, useRef, useState } from 'react';
import { PlayerPause, PlayerPlay, VolumeOff, Volume, Download, BrandYoutube } from 'tabler-icons-react';
import { MetaTags } from "../functions"
import Autolinker from "autolinker"
import type {videoInfo} from 'ytdl-core';

const Player: NextPage = () => {
    const [id, setID]: any = useState("")
    const [paused, setPaused] = useState(true)
    const [details, setDetails] = useState<any>(false)
    const [prevVol, setPrevVol] = useState(100)
    const [volume, setVolume] = useLocalStorage<any>({
        key: 'volume',
        defaultValue: 100,
    });
    const [loading, setLoading] = useLocalStorage<boolean>({
        key: 'loading',
        defaultValue: false,
      });
    if (typeof window !== 'undefined' && !id) {
        setID((new URLSearchParams(window.location.search).get('v')))
    }

    const mute = () => {
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
    }

    useHotkeys([["M", () => { mute() }],
    ['space', () => { setPaused(!paused) }],])

    useEffect(() => {
        if (typeof window !== 'undefined' && id !== 'dev') {
            if (document.getElementsByTagName('audio')[0].src) { return }
            document.getElementsByTagName('audio')[0].src = `${document.location.origin}/api/stream?v=${id}`
            const downBtn = document.querySelector("#download") as HTMLAnchorElement | null
            downBtn!.href = `${document.location.origin}/api/stream?v=${id}`
        }

        if (typeof window !== 'undefined' && !details) {
            if (id == 'dev') {
                setDetails({
                    'videoDetails': {
                        'title': 'placeholderTitle',
                        'author': {
                            'name': 'placeholderAuthor'
                        },
                        'thumbnails': [
                            { 'url': 'placeholder-1280x720.gif' }
                        ]
                    }
                })
            } else {
                fetch(`${document.location.origin}/api/details?v=${id}`).then(async resp => { setDetails(await resp.json()) })
                const vu = document.querySelector('#videoURL') as HTMLAnchorElement
                vu.href = `https://youtu.be/${id}`
            }
        }
    }, [id, details])

    useEffect(()=>{
        if(details){
            const detailsD = document.querySelector('#songDetails') as HTMLDivElement
            detailsD.querySelector('h1')!.innerText = details.videoDetails.title
            detailsD.querySelector('h2')!.innerText = details.videoDetails.author.name
            detailsD.querySelector('span')!.innerText = details.videoDetails?.thumbnails[details.videoDetails.thumbnails.length - 1].url
            detailsD.querySelector('p')!.innerText = details.videoDetails?.description
        }
    },[details])

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
                <Box sx={{ marginTop: '-2.5%', position: 'relative', borderRadius: '25%', clipPath: 'circle(30%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image draggable='false' sx={{ filter: 'brightness(0.7)', width: '100%', minWidth: '45vw', maxWidth: '25vh' }} mx='md' alt={details.videoDetails?.title} src={details.videoDetails?.thumbnails[details.videoDetails.thumbnails.length - 1].url} />
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
            console.log(volume / 100)
            document.getElementsByTagName('audio')[0].volume = volume / 100
        }
    }, [volume])

    var autolinker = new Autolinker({
        newWindow: true,
        sanitizeHtml: true,
        className: 'link'
    });

    return (
        <>
            <Player />
            <div style={{ margin: '0 10vw' }}>
                <Group mb={2} spacing={4} direction='row'>
                    <Text size='xl'>{details.videoDetails?.title}</Text>
                    <a id='videoURL' target='_blank' rel="noreferrer">
                        <ActionIcon variant='transparent'>
                            <BrandYoutube />
                        </ActionIcon>
                    </a>
                </Group>
                <Text size='sm'>{details.videoDetails?.author.name}</Text>
                <Divider my='md' />
                <Group spacing='sm' mb='sm' position='center'>
                    <ActionIcon onClick={mute}>
                        {volume === 0 ? <Volume /> : <VolumeOff />}
                    </ActionIcon>
                    <a className='nodim' id='download' onClick={(e) => {
                        showNotification({
                            'title': 'Downloading',
                            'message': 'The download has started, please wait!',
                            'icon': <Download />,
                            'id': 'Download'
                        })
                    }} download>
                        <ActionIcon>
                            <Download />
                        </ActionIcon>
                    </a>
                </Group>
                <InputWrapper label="Volume">
                    <Slider value={volume} onChange={setVolume} marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                    ]} />
                </InputWrapper>
                <Space h='xl' />
                <Divider my='sm' />
                <Text align='center' size='xl'>Description</Text>
                <Text dangerouslySetInnerHTML={{ __html: autolinker.link(details.videoDetails?.description) }} sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}></Text>
            </div>
        </>
    )
}

export default Player;
