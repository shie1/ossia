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
    const [sliderVal, setSliderVal] = useState(volume)

    var autolinker = new Autolinker({
        newWindow: true,
        sanitizeHtml: true,
        className: 'link'
    });

    useEffect(() => {
        if (props.details) {
            if (props.details == songDetails) { return }
            setSongDetails(props.details)
        }
    }, [songDetails, props.details, setSongDetails])

    useEffect(() => {
        const timeoutId = setTimeout(() => setVolume(sliderVal), 1000);
        return () => clearTimeout(timeoutId);
    }, [setVolume, sliderVal])

    useEffect(() => {
        if (related.length === 0) {
            fetch(`${props.protocol}://${props.host}/api/youtube/related`, { 'method': 'POST', body: JSON.stringify(props.details) }).then(async (resp) => {
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
    }, [currentLQ, props.details, props.host, props.protocol, related])

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
            <Text className="revealText" sx={(theme) => ({ transition: '3.5s', position: 'relative', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: (!reveal ? '10.6em' : '500em'), overflow: 'hidden', '::before': { background: (!reveal ? `linear-gradient(transparent 0, ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.light[2]})` : 'unset') } })} dangerouslySetInnerHTML={{ __html: autolinker.link(props.details.description) }} />
            <Collapse in={!reveal}>
                <Text onClick={() => { setReveal(true) }} className="link">Read more...</Text>
            </Collapse>
        </>)
    }

    return (<>
        <Meta pageTitle={props.details.title ? `${props.details.title} | Ossia` : 'Ossia'} />
        <Container>
            <Text mb='md' size='lg'>Player</Text>
            <Center>
                <Image className="rnd" alt={props.details.title} sx={{ maxWidth: '80vh' }} mb='md' src={props.details.thumbnails[currentLQ ? 0 : props.details.thumbnails.length - 1].url} />
            </Center>
            <Group mb='sm' direction="column" spacing={2}>
                <Text size="xl">{props.details.title}</Text>
                <Text size="md">{props.details.author.name}</Text>
            </Group>
            <Group position="center">
                <ActionIcon size='xl' onClick={() => { setPaused(!paused) }}>
                    {paused ? <PlayerPlay /> : <PlayerPause />}
                </ActionIcon>
            </Group>
            <InputWrapper label="Volume">
                <Slider value={sliderVal} onChange={setSliderVal} marks={[
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
    if (ctx.query['v']) {
        return {
            props: {
                host: ctx.req.headers.host,
                'protocol': protocol,
                id: ctx.query['v'],
                details: (await (await fetch(`${protocol}://${ctx.req.headers.host}/api/youtube/details?v=${ctx.query['v']}`)).json())['videoDetails'],
            },
        }
    } else {
        return {
            props: {
                host: ctx.req.headers.host,
                'protocol': protocol
            }
        }
    }
}

export default Listen