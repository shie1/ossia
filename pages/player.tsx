import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem, ActionIcon, Center, Container, Group, Image, Paper, SegmentedControl, Slider, Space, Text } from "@mantine/core";
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
    const [volume, setVolume] = useLocalStorage<number>({ 'key': 'volume', 'defaultValue': 100 })
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
    return (<Container>
        <Center>
            <Image radius="lg" sx={{ maxWidth: '60vh' }} mb="sm" src={streamDetails.thumbnailUrl} alt={streamDetails.title} />
        </Center>
        <Text mb={2} size="xl" dangerouslySetInnerHTML={{ __html: streamDetails.title }} />
        <Text dangerouslySetInnerHTML={{ __html: streamDetails.uploader }} />
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
        <Center my="sm">
            <ActionGroup>
                <SegmentedControl onChange={(e) => { setVolume(Number(e)) }} value={volume.toString()} sx={(theme) => ({ background: 'unset' })} radius="lg" data={[
                    { label: 'Muted', value: '0' },
                    { label: 'Low', value: '30' },
                    { label: 'High', value: '70' },
                    { label: 'Max', value: '100' }
                ]} />
            </ActionGroup>
        </Center>
        <Accordion>
            <AccordionItem icon={<Notes />} label={localized.description}>
                <Text sx={{ wordBreak: 'break-word', 'whiteSpace': 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: Autolinker.link(streamDetails.description, { email: true, className: "autolinker click" }) }} />
            </AccordionItem>
            <AccordionItem icon={<LayoutList />} label={localized.related}>
                <VideoGrid videos={streamDetails.relatedStreams} />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Player