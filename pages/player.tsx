import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ActionIcon, Center, Container, Group, Image, Paper, Text } from "@mantine/core";
import { usePlayer } from "../components/player";
import { PlayerPause, PlayerPlay, Playlist, X } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { AddToPlaylist } from "../components/playlist";
import { useRouter } from "next/router";
import { localized } from "../components/localization";

const Player: NextPage = () => {
    const [streamDetails, setStreamDetails] = useLocalStorage<any>({ 'key': 'stream-details', 'defaultValue': {} })
    const [atp, setAtp] = useState(false)
    const player = usePlayer()
    const router = useRouter()
    if (Object.keys(streamDetails).length === 0) {
        router.replace("/")
        return <></>
    }
    return (<Container>
        <AddToPlaylist songId={streamDetails.thumbnailUrl.split("/")[4]} opened={atp} onClose={() => { setAtp(false) }} />
        <Center>
            <Image radius="lg" sx={{ maxWidth: '60vh' }} mb="sm" src={streamDetails.thumbnailUrl} alt={streamDetails.title} />
        </Center>
        <Text mb={2} size="xl" dangerouslySetInnerHTML={{ __html: streamDetails.title }} />
        <Text mb="sm" dangerouslySetInnerHTML={{ __html: streamDetails.uploader }} />
        <ActionGroup>
            <Action onClick={() => { player.pop() }} label={localized.endPlayback}>
                <X />
            </Action>
            <Action onClick={() => { player.toggleState() }} label={player?.paused ? localized.play : localized.pause}>
                {player?.paused ? <PlayerPlay /> : <PlayerPause />}
            </Action>
            <Action onClick={() => { setAtp(true) }} label={localized.addToPlaylist}>
                <Playlist />
            </Action>
        </ActionGroup>
    </Container>)
}

export default Player