import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ActionIcon, Center, Container, Group, Image, Paper, Text } from "@mantine/core";
import { usePlayer } from "../components/player";
import { PlayerPause, PlayerPlay, Playlist } from "tabler-icons-react";
import { ActionGroup } from "../components/action";
import { AddToPlaylist } from "../components/playlist";

const Player: NextPage = () => {
    const [streamDetails, setStreamDetails] = useLocalStorage<any>({ 'key': 'stream-details', 'defaultValue': {} })
    const [atp, setAtp] = useState(false)
    const player = usePlayer()
    if (Object.keys(streamDetails).length === 0) {
        return <meta httpEquiv="refresh" content="0;URL=/" />
    }
    return (<Container>
        <AddToPlaylist songId={streamDetails.thumbnailUrl.split("/")[4]} opened={atp} onClose={() => { setAtp(false) }} />
        <Center>
            <Image radius="lg" sx={{ maxWidth: '60vh' }} mb="sm" src={streamDetails.thumbnailUrl} alt={streamDetails.title} />
        </Center>
        <Text mb={2} size="xl" dangerouslySetInnerHTML={{ __html: streamDetails.title }} />
        <Text mb="sm" dangerouslySetInnerHTML={{ __html: streamDetails.uploader }} />
        <ActionGroup>
            <ActionIcon radius="xl" size="xl" variant="default" onClick={() => { setAtp(true) }} >
                <Playlist />
            </ActionIcon>
            <ActionIcon radius="xl" size="xl" variant="default" onClick={player.toggleState}>
                {player?.paused ? <PlayerPlay /> : <PlayerPause />}
            </ActionIcon>
        </ActionGroup>
    </Container>)
}

export default Player