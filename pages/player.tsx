import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ActionIcon, Center, Container, Group, Image, Text } from "@mantine/core";
import { usePlayer } from "../components/player";
import { PlayerPause, PlayerPlay } from "tabler-icons-react";
import { useRouter } from "next/router";

const Player: NextPage = () => {
    const [streamDetails, setStreamDetails] = useLocalStorage<any>({ 'key': 'stream-details', 'defaultValue': {} })
    const player = usePlayer()
    if(Object.keys(streamDetails).length === 0){
        return <meta httpEquiv="refresh" content="0;URL=/" />
    }
    return (<Container>
        <Center>
            <Image sx={{ maxWidth: '60vh' }} mb="sm" src={streamDetails.thumbnailUrl} alt={streamDetails.title} />
        </Center>
        <Text mb={2} size="xl" dangerouslySetInnerHTML={{ __html: streamDetails.title }} />
        <Text dangerouslySetInnerHTML={{ __html: streamDetails.uploader }} />
        <Group position="center">
            <ActionIcon onClick={player.toggleState}>
                {player?.paused ? <PlayerPlay/> : <PlayerPause />}
            </ActionIcon>
        </Group>
    </Container>)
}

export default Player