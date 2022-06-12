import { ActionIcon, AspectRatio, Text, Image, Group, InputWrapper, Slider, Space, Divider, SegmentedControl } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BrandYoutube, Download, Heart, Heartbeat, PlayerPause, PlayerPlay, Volume, VolumeOff, X } from 'tabler-icons-react'
import Autolinker from 'autolinker'

const Player: NextPage = () => {
    const [volume, setVolume] = useLocalStorage({
        key: 'volume', defaultValue: 100
    })
    const [prevVol, setPrevVol] = useState(100)
    const [paused, setPaused] = useLocalStorage(
        { key: 'paused', defaultValue: true }
    )
    const [liked, setLiked] = useLocalStorage<Array<any>>(
        { key: 'liked-songs', defaultValue: [] }
    );
    const [history, setHistory] = useLocalStorage<Array<any>>(
        { key: 'history', defaultValue: [] }
    );

    var autolinker = new Autolinker({
        newWindow: true,
        sanitizeHtml: true,
        className: 'link'
    });
    const router = useRouter()

    const isLiked = (song: string) => {
        return liked.findIndex(item => item.id == song) != -1
    }

    const play = () => {
        const audioE = document.querySelector('audio') as HTMLAudioElement
        if (audioE?.paused) {
            audioE?.play()
        } else {
            audioE?.pause()
        }
    }

    const mute = () => {
        if (volume == 0) {
            showNotification({
                'icon': <Volume />,
                'title': 'Unmuted',
                'message': '',
            })
            setVolume(prevVol)
        } else {
            showNotification({
                'icon': <VolumeOff />,
                'title': 'Muted',
                'message': '',
            })
            setPrevVol(volume)
            setVolume(0)
        }
    }

    const clearSong = () => {
        if (typeof window === 'undefined') { return }
        const audioE = document.querySelector('audio') as HTMLAudioElement
        audioE.src = ''
        const detailsE = document.querySelector('#songDetails') as HTMLDivElement
        detailsE.querySelector('h1')!.innerHTML = ''
        detailsE.querySelector('h2')!.innerHTML = ''
        detailsE.querySelector('div')!.innerHTML = ''
        detailsE.querySelector('span')!.innerHTML = ''
        detailsE.querySelector('p')!.innerHTML = ''
        router.push('/')
    }

    const addLike = () => {
        if (typeof window === 'undefined') { return }
        const song = {
            'id': document.querySelector("#songDetails div")?.innerHTML,
            'title': document.querySelector("#songDetails h1")?.innerHTML,
            'thumbnail': document.querySelector("#songDetails span")?.innerHTML,
            'added': (new Date()).toUTCString()
        }

        const take = (list: any, val: any) => {
            return list.filter((value: any, index: any, arr: any) => {
                return value.id != val;
            });
        }

        const id = document.querySelector("#songDetails div")!.innerHTML
        if (isLiked(id)) {
            setLiked(take(liked, id));
        } else {
            setLiked(oldArray => [song, ...oldArray]);
        }
    }

    const Player = () => {
        if (typeof window === 'undefined') { return <></> }
        if (!document?.querySelector("#songDetails span")?.innerHTML) {
            return (
                <>
                    <Text m='md' align='center'>No music playing!</Text>
                </>
            )
        }
        return (
            <div>
                <AspectRatio mb='sm' ratio={1280 / 720}>
                    <Image alt='a' src={document?.querySelector("#songDetails span")?.innerHTML} />
                </AspectRatio>
                <Group mb={1} spacing={4} direction='row'>
                    <Text size='xl'>{document?.querySelector("#songDetails h1")?.innerHTML}</Text>
                    <a href={`https://youtu.be/${document?.querySelector("#songDetails div")?.innerHTML}`} target='_blank' rel="noreferrer">
                        <ActionIcon variant='transparent'>
                            <BrandYoutube />
                        </ActionIcon>
                    </a>
                </Group>
                <Text size='sm'>{document?.querySelector("#songDetails h2")?.innerHTML}</Text>
                <Group my='sm' position="center">
                    <ActionIcon size='xl' onClick={clearSong}>
                        <X />
                    </ActionIcon>
                    <ActionIcon size='xl' onClick={mute}>
                        {volume === 0 ? <VolumeOff /> : <Volume />}
                    </ActionIcon>
                    <ActionIcon size='xl' onClick={play}>
                        {paused ? <PlayerPlay /> : <PlayerPause />}
                    </ActionIcon>
                    <a href={`${document?.location.origin}/api/stream?v=${document?.querySelector("#songDetails div")?.innerHTML}`} className='nodim' id='download' onClick={() => {
                        showNotification({
                            'title': 'Downloading',
                            'message': 'The download has started, please wait!',
                            'icon': <Download />,
                            'id': 'Download'
                        })
                    }} download>
                        <ActionIcon size='xl'>
                            <Download />
                        </ActionIcon>
                    </a>
                    <ActionIcon size='xl' onClick={addLike}>
                        {isLiked(document.querySelector("#songDetails div")!.innerHTML) ? <Heartbeat /> : <Heart />}
                    </ActionIcon>
                </Group>
                <InputWrapper label="Volume">
                    <Group position='center'>
                        <SegmentedControl transitionDuration={0} value={volume.toString()} onChange={val => { setVolume(Number(val)) }}
                            data={[
                                { label: 'Muted', value: '0' },
                                { label: 'Low', value: '25' },
                                { label: 'Medium', value: '50' },
                                { label: 'High', value: '75' },
                                { label: 'Max', value: '100' },
                            ]}
                        />
                    </Group>
                </InputWrapper>
                <Divider my='sm' />
                <Text align='center' mb={2} size='xl'>Description</Text>
                <Text sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: autolinker.link(document.querySelector("#songDetails p")!.innerHTML.replace(/<br>/g, '\n')) }} />
            </div >
        )
    }

    return (
        <>
            <Player />
        </>
    )
}

export default Player