import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { interactivePaper, Meta, SCollapse, VideoGrid } from "../components";
import { Container, Text, ActionIcon, Group, Divider, Center, Image, InputWrapper, Slider, Space, Paper, Collapse } from "@mantine/core";
import { PlayerPlay, PlayerPause, InfoCircle, ListDetails } from "tabler-icons-react";
import Autolinker from "autolinker";

const Listen: NextPage = (props: any) => {
    const [songDetails, setSongDetails] = useLocalStorage<any>({ 'key': 'song-details', 'defaultValue': {} })
    const [volume, setVolume] = useLocalStorage<number>({ 'key': 'volume', 'defaultValue': 100 })
    const [paused, setPaused] = useLocalStorage<boolean>({ 'key': 'paused', 'defaultValue': false })
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({ 'key': 'current-low-quality-mode', 'defaultValue': false })
    const [firstLoad, setFirstLoad] = useState<boolean>(true)
    const [related, setRelated] = useState<Array<any>>([])
    const [disp, setDisp] = useState(true)

    var autolinker = new Autolinker({
        newWindow: true,
        sanitizeHtml: true,
        className: 'link'
    });

    useEffect(() => {
        if (related.length === 0) {
            fetch(`${props.protocol}://${props.host}/api/youtube/related`, { 'method': 'POST', body: JSON.stringify(songDetails) }).then(async (resp) => {
                const result = await resp.json()
                let vids: any = []
                result.map((video: any) => {
                    if (video === false) { vids.push(video) }
                    if (!video["duration_raw"]) { return }
                    vids.push({ 'id': video.id.videoId, 'title': video.title, 'author': '', 'thumbnail': currentLQ ? video.snippet.thumbnails.default.url : video.snippet.thumbnails.high.url, 'length': video["duration_raw"] })
                })
                setRelated(vids)
            })
        }
    }, [currentLQ, props.details, props.host, props.protocol, related, songDetails])

    useEffect(() => {
        if (typeof window !== 'undefined' && firstLoad && props.id) {
            if ((document.querySelector("audio#mainPlayer") as HTMLAudioElement).src == `${location.origin}/api/youtube/stream?v=${props.id}${currentLQ ? '&q=lowestaudio' : ''}`) { return }
            (document.querySelector("audio#mainPlayer") as HTMLAudioElement).src = `${location.origin}/api/youtube/stream?v=${props.id}${currentLQ ? '&q=lowestaudio' : ''}`
            setFirstLoad(true)
        }
    }, [currentLQ, firstLoad, props.id])

    const Description = () => {
        const [reveal, setReveal] = useState(false)
        return (<>
            <Text className="revealText" sx={(theme) => ({ transition: '3.5s', position: 'relative', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: (!reveal ? '10.6em' : '500em'), overflow: 'hidden', '::before': { background: (!reveal ? `linear-gradient(transparent 0, ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.light[2]})` : 'unset') } })} dangerouslySetInnerHTML={{ __html: autolinker.link(songDetails?.description) }} />
            <Collapse in={!reveal}>
                <Text onClick={() => { setReveal(true) }} className="link">Read more...</Text>
            </Collapse>
        </>)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!(document.querySelector("audio#mainPlayer") as HTMLAudioElement).src) {
                setDisp(false)
            }
        }
    }, [])

    if (!disp) { return <></> }
    return (<>
        <Meta pageTitle={songDetails?.title ? `${songDetails?.title} | Ossia` : 'Ossia'} />
        <Container>
            <Text mb='md' size='lg'>Player</Text>
            <Center>
                <Image className="rnd" alt={songDetails?.title} sx={{ maxWidth: '80vh' }} mb='md' src={songDetails?.thumbnails[currentLQ ? 0 : songDetails?.thumbnails.length - 1].url} />
            </Center>
            <Group mb='sm' direction="column" spacing={2}>
                <Text size="xl">{songDetails?.title}</Text>
                <Text size="md">{songDetails?.author.name}</Text>
            </Group>
            <Group position="center">
                <ActionIcon size='xl' onClick={() => { setPaused(!paused) }}>
                    {paused ? <PlayerPlay /> : <PlayerPause />}
                </ActionIcon>
            </Group>
            <InputWrapper label="Volume">
                <Slider value={volume} onChange={setVolume} marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                ]} />
            </InputWrapper>
            <Space h='xl' />
            <Divider my='md' size='xl' />
            <Description />
            <Space h='md' />
            <VideoGrid videos={related[0] === false ? [] : related} />
        </Container>
    </>)
}

export async function getServerSideProps(ctx: any) {
    const protocol = (ctx.req.headers['x-forwarded-proto'] || ctx.req.headers.referer?.split('://')[0] || 'http')
    return {
        props: {
            host: ctx.req.headers.host,
            'protocol': protocol
        }
    }
}

export default Listen