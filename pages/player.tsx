import {
    Accordion,
    AccordionItem,
    Center,
    Container,
    Group,
    Image,
    InputWrapper,
    Slider,
    Text,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import Autolinker from "autolinker";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    X,
    PlayerPlay,
    PlayerPause,
    BrandYoutube,
    Notes,
    LayoutList,
    List,
    PlayerSkipForward,
    Playlist,
} from "tabler-icons-react";
import { ActionGroup, Action } from "../components/action";
import { localized } from "../components/localization";
import { AddToPlaylist } from "../components/playlist";
import { useForceUpdate } from "../components/react";
import { useCustomRouter } from "../components/redirect";
import { Song } from "../components/song";
import { VideoGrid } from "../components/video";

const Player: NextPage = (props: any) => {
    const [volume, setVolume] = props.volume
    const [queue, setQueue] = props.player.queue
    const customRouter = useCustomRouter()
    const router = useRouter()
    const [ctx, setCtx] = useState(false)
    const atp = useState(false)
    let key = 0
    const { playerDisp } = props.player
    const forceUpdate = useForceUpdate()
    const volumeSteps = 8

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener("ossia-queue-update", forceUpdate)
        }
    }, [])

    useHotkeys([
        ["ArrowUp", () => { setVolume(volume + volumeSteps > 100 ? 100 : volume + volumeSteps) }],
        ["ArrowDown", () => { setVolume(volume - volumeSteps < 0 ? 0 : volume - volumeSteps) }],
    ])

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
            {props.playlists && Object.keys(playerDisp).length && <AddToPlaylist open={atp[0]} setOpen={atp[1]} songId={props.player.streams.thumbnailUrl.split("/")[4]} songTitle={playerDisp.SONG} playlists={props.playlists} />}
            <ActionGroup>
                <Action onClick={() => { props.player.pop() }} label={localized.endPlayback}>
                    <X />
                </Action>
                {props.playlists && <>
                    {props.playlists.length ? <Action label={localized.addToPlaylist} onClick={() => { atp[1](true) }}>
                        <Playlist />
                    </Action> : <></>}
                </>}
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
                <Action label={localized.next} onClick={() => { props.player.skip() }}>
                    <PlayerSkipForward />
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
            <AccordionItem label={localized.queue} icon={<List />}>
                <Group spacing={6} direction="column">
                    {props.player.queue[0].map((song: any, i: number) => {
                        return (<Song key={i} title={song.SONG} artist={song.ARTIST} id={song.id} image={song.ALBUMART} player={props.player} index={i} type="queue">
                            <Action onClick={() => { props.player.removeFromQueue(i) }}>
                                <X />
                            </Action>
                        </Song>)
                    })}
                </Group>
            </AccordionItem>
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