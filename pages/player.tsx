import { Accordion, AccordionItem, Center, Container, Group, Image, InputWrapper, SegmentedControl, Slider, Text } from "@mantine/core";
import Autolinker from "autolinker";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X, PlayerPlay, PlayerPause, BrandYoutube, Notes, LayoutList, Router } from "tabler-icons-react";
import { ActionGroup, Action } from "../components/action";
import { localized } from "../components/localization";
import { useCustomRouter } from "../components/redirect";
import { VideoGrid } from "../components/video";

const Player: NextPage = (props: any) => {
    const player = props.player
    const [volume, setVolume] = props.volume
    const customRouter = useCustomRouter()
    const router = useRouter()
    const { playerDisp } = player

    useEffect(() => {
        if (!Object.keys(player.playerDisp).length) {
            router.replace("/")
        }
    }, [player.playerDisp])

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
                <Action onClick={() => { player.pop() }} label={localized.endPlayback}>
                    <X />
                </Action>
                <Action onClick={() => { player.paused[1](!player.paused[0]) }} label={player?.paused[0] ? localized.play : localized.pause}>
                    {player?.paused[0] ? <PlayerPlay /> : <PlayerPause />}
                </Action>
                <Action onClick={() => { customRouter.newTab(`https://youtube.com/watch?v=${player.streams.thumbnailUrl.split("/")[4]}`) }} label={localized.openInYt}>
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
            <AccordionItem icon={<Notes />} label={localized.description}>
                <Text sx={{ wordBreak: 'break-word', 'whiteSpace': 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: Autolinker.link(player.streams.description, { email: true, className: "autolinker click" }) }} />
            </AccordionItem>
            <AccordionItem icon={<LayoutList />} label={localized.related}>
                <VideoGrid touchScreen={props.touchScreen} player={player} videos={player.streams.relatedStreams} />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Player