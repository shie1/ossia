import {
    Accordion,
    AccordionItem,
    Center,
    Container,
    Group,
    Image,
    InputWrapper,
    Loader,
    Paper,
    Slider,
    Text,
} from "@mantine/core";
import Autolinker from "autolinker";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X, PlayerPlay, PlayerPause, BrandYoutube, Notes, LayoutList, List } from "tabler-icons-react";
import { ActionGroup, Action } from "../components/action";
import { localized } from "../components/localization";
import { useForceUpdate } from "../components/react";
import { useCustomRouter } from "../components/redirect";
import { Song } from "../components/song";
import { VideoGrid } from "../components/video";

const Player: NextPage = (props: any) => {
    const [volume, setVolume] = props.volume
    const [queue, setQueue] = useState([])
    const customRouter = useCustomRouter()
    const router = useRouter()
    let key = 0
    const { playerDisp } = props.player
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        setInterval(forceUpdate, 1500)
    }, [])

    useEffect(() => {
        if (!Object.keys(props.player.playerDisp).length) {
            router.replace("/")
        }
    }, [props.player.playerDisp])

    return (<Container>
        <Head>
            <title>Player | Ossia</title>
        </Head>
        <Center>
            <Image imageProps={{ draggable: false }} draggable={false} radius="lg" style={{ maxWidth: '30vh', minWidth: '40%' }} mb="sm" src={playerDisp.ALBUMART} alt={playerDisp.SONG} />
        </Center>
        <Group>
            <Group direction="column" spacing={2}>
                <Text size="xl" dangerouslySetInnerHTML={{ __html: playerDisp.SONG }} />
                <Text dangerouslySetInnerHTML={{ __html: `${playerDisp.ALBUM ? `${playerDisp.ARTIST} - ${playerDisp.ALBUM}` : playerDisp.ARTIST}` }} />
            </Group>
        </Group>
        <Group align="center" spacing="sm" direction="column" my="md">
            <ActionGroup>
                <Action onClick={() => { props.player.pop() }} label={localized.endPlayback}>
                    <X />
                </Action>
                <Action onClick={() => {
                    if (props.player.paused[0]) {
                        props.player.playerRef.current.play()
                        props.player.paused[1](false)
                    } else {
                        props.player.playerRef.current.pause()
                        props.player.paused[1](true)
                    }
                }} label={props.player?.paused[0] ? localized.play : localized.pause}>
                    {props.player?.paused[0] ? <PlayerPlay /> : <PlayerPause />}
                </Action>
                <Action onClick={() => { customRouter.newTab(`https://youtube.com/watch?v=${props.player.streams.thumbnailUrl.split("/")[4]}`) }} label={localized.openInYt}>
                    <BrandYoutube />
                </Action>
            </ActionGroup>
            <InputWrapper mb="sm" sx={{ width: '100%' }} label={localized.volume}>
                <Slider label={(val) => `${val}%`} marks={[
                    { 'value': 0, label: '0%' },
                    { 'value': 50, label: '50%' },
                    { 'value': 100, label: '100%' },
                ]} onChange={setVolume} value={volume} />
            </InputWrapper>
        </Group>
        <Accordion>
            {<AccordionItem label={localized.queue} icon={<List />}>
                {props.player.queue[0].length ? <Group spacing="sm">
                    {props.player.queue[0].map((item: any) => {
                        key++
                        return (typeof item !== "string" ? <Song noInteraction artist={item.ARTIST} title={item.SONG} id={item.id} image={item.ALBUMART} player={props.player} key={key} /> : <Paper key={key} p="sm" style={{ width: '100%', position: 'relative' }}>
                            <Center>
                                <Group direction="row">
                                    <Loader />
                                    <Text size="lg">{item}</Text>
                                </Group>
                            </Center>
                        </Paper>)
                    })}
                </Group> : <Center><Text>The queue is empty!</Text></Center>}
            </AccordionItem>}
            <AccordionItem icon={<Notes />} label={localized.description}>
                <Text sx={{ wordBreak: 'break-word', 'whiteSpace': 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: Autolinker.link(props.player.streams.description, { email: true, className: "autolinker click" }) }} />
            </AccordionItem>
            <AccordionItem icon={<LayoutList />} label={localized.related}>
                <VideoGrid playlists={props.playlists} touchScreen={props.touchScreen} player={props.player} videos={props.player.streams.relatedStreams} />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Player