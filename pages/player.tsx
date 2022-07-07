import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem, Image, ActionIcon, BackgroundImage, Center, Container, Group, Paper, SegmentedControl, Slider, Space, Text } from "@mantine/core";
import { usePlayer } from "../components/player";
import { InfoCircle, LayoutList, Notes, PlayerPause, PlayerPlay, Playlist, X } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { useRouter } from "next/router";
import { localized } from "../components/localization";
import { VideoGrid } from "../components/video";
import Autolinker from 'autolinker';
import { wip } from "../components/notifications";

const Player: NextPage = () => {
    const [streamDetails, setStreamDetails] = useLocalStorage<any>({ 'key': 'stream-details', 'defaultValue': {} })
    const [playerContent, setPlayerContent] = useLocalStorage<any>({ 'key': 'player-content', 'defaultValue': {} })
    const [volume, setVolume] = useLocalStorage<number>({ 'key': 'volume', 'defaultValue': 90 })
    const router = useRouter()
    const player = usePlayer()
    useEffect(() => {
        if (Object.keys(streamDetails).length === 0) {
            router.replace("/")
        }
    }, [router, streamDetails])
    if (Object.keys(streamDetails).length === 0) {
        return <></>
    }
    return (<div style={{ position: 'relative' }}>
        <Center className="background-glow" style={{ filter: 'blur(8rem) contrast(100%)', position: 'fixed', top: 50, height: '10rem' }}>
            <div style={{background: `url(${playerContent.cover}`, height: '5vh', width: '83vw'}} draggable={false} />
        </Center>
        <Container>
            <Center>
                <Image imageProps={{draggable: false}} draggable={false} radius="lg" style={{ maxWidth: '30vh', minWidth: '40%' }} mb="sm" src={playerContent.cover} alt={playerContent.title} />
            </Center>
            <Text mb={2} size="xl" dangerouslySetInnerHTML={{ __html: playerContent.title }} />
            <Text dangerouslySetInnerHTML={{ __html: `${playerContent.album ? `${playerContent.artist} - ${playerContent.album}` : playerContent.artist}` }} />
            <Group align="center" spacing="sm" direction="column" my="md">
                <ActionGroup>
                    <Action onClick={() => { player.pop() }} label={localized.endPlayback}>
                        <X />
                    </Action>
                    <Action onClick={() => { player.toggleState() }} label={player?.paused ? localized.play : localized.pause}>
                        {player?.paused ? <PlayerPlay /> : <PlayerPause />}
                    </Action>
                    <Action onClick={wip} label={localized.addToPlaylist}>
                        <Playlist />
                    </Action>
                </ActionGroup>
                <ActionGroup>
                    <SegmentedControl onChange={(e) => { setVolume(Number(e)) }} value={volume.toString()} sx={(theme) => ({ background: 'unset' })} radius="lg" data={[
                        { label: localized.muted, value: '0' },
                        { label: localized.low, value: '30' },
                        { label: localized.medium, value: '60' },
                        { label: localized.high, value: '90' }
                    ]} />
                </ActionGroup>
            </Group>
            <Accordion>
                <AccordionItem icon={<Notes />} label={localized.description}>
                    <Text sx={{ wordBreak: 'break-word', 'whiteSpace': 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: Autolinker.link(streamDetails.description, { email: true, className: "autolinker click" }) }} />
                </AccordionItem>
                <AccordionItem icon={<LayoutList />} label={localized.related}>
                    <VideoGrid videos={streamDetails.relatedStreams} />
                </AccordionItem>
            </Accordion>
        </Container>
    </div>)
}

export default Player