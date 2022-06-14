import { ActionIcon, AspectRatio, Text, Image, Group, InputWrapper, Slider, Space, Divider, SegmentedControl, Card, Badge, SimpleGrid, Collapse, Accordion, AccordionItem } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BrandYoutube, Download, Heart, Heartbeat, InfoCircle, Music, PlayerPause, PlayerPlay, RepeatOff, RepeatOnce, Volume, VolumeOff, X } from 'tabler-icons-react'
import Autolinker from 'autolinker'
import { setSong } from '../functions'

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
    const [loop, setLoop] = useLocalStorage({
        key: 'loop', defaultValue: true
    })

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

    const Related = ({ json }: any) => {
        const related = JSON.parse(json)["related_videos"]
        let i = 0
        const Video = ({ video }: any) => {
            return (
                <Card sx={{ cursor: 'pointer', transition: '100ms', ":hover": { transform: 'scale(1.05)' } }} shadow="sm" p="lg" onClick={() => { setSong(video.id) }}>
                    <Card.Section>
                        <AspectRatio ratio={1280 / 720}>
                            <Image src={video.thumbnails[video.thumbnails.length - 1].url} alt={video.title} />
                        </AspectRatio>
                    </Card.Section>

                    <Group position="apart" mt='sm'>
                        <Text dangerouslySetInnerHTML={{ __html: video.title }} sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} weight={500} />
                    </Group>
                </Card>
            )
        }
        return (
            <ul style={{ all: 'unset' }}>
                <SimpleGrid cols={3} spacing='sm' breakpoints={[
                    { maxWidth: 925, cols: 2, spacing: 'sm' },
                    { maxWidth: 600, cols: 1, spacing: 'sm' },
                ]}>
                    {related.map((item: any) => {
                        if (!item.length_seconds) { return <></> }
                        i++
                        return (
                            <li style={{ all: 'unset' }} key={i}>
                                <Video video={item} />
                            </li>
                        );
                    })}
                </SimpleGrid>
            </ul>
        )
    }

    const Player = () => {
        const [descOpen, setDescOpen] = useState<boolean>(false)
        const [relOpen, setRelOpen] = useState<boolean>(false)
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
                    <Text dangerouslySetInnerHTML={{ __html: document?.querySelector("#songDetails h1")!.innerHTML }} size='xl' />
                    <a href={`https://youtu.be/${document?.querySelector("#songDetails div")?.innerHTML}`} target='_blank' rel="noreferrer">
                        <ActionIcon variant='transparent'>
                            <BrandYoutube />
                        </ActionIcon>
                    </a>
                </Group>
                <Text dangerouslySetInnerHTML={{ __html: document?.querySelector("#songDetails h2")!.innerHTML }} size='sm' />
                <Group my='sm' position="center">
                    <ActionIcon size='xl' onClick={clearSong}>
                        <X />
                    </ActionIcon>
                    <ActionIcon size='xl' onClick={() => { setLoop(!loop) }}>
                        {loop ? <RepeatOnce /> : <RepeatOff />}
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
                <Accordion>
                    <AccordionItem icon={<InfoCircle />} label="Description">
                        <Text sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: autolinker.link(document.querySelector("#songDetails p")!.innerHTML.replace(/<br>/g, '\n')) }} />
                    </AccordionItem>
                    <AccordionItem icon={<Music />} label="Related songs">
                        <Related json={document?.querySelector("#songDetails section")!.innerHTML} />
                    </AccordionItem>
                </Accordion>
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