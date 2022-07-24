import { Card, Grid, Image, Text, Collapse, Menu, Group, Divider, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router"
import { useState } from "react";
import { Dots, PlaylistAdd, SortAscending, SortDescending } from "tabler-icons-react";
import { Action } from "./action";
import { apiCall } from "./api"
import { localized } from "./localization"
import { AddToPlaylist } from "./playlist";
import { interactive } from "./styles"

export const Video = ({ video, player, touchScreen, playlists }: any) => {
    const router = useRouter()
    const add = useState(false)
    video.id = (video.thumbnail || video.thumbnailUrl).split("/")[4]
    const [ctx, setCtx] = useState(false)
    if (!video) { return <></> }
    let type = ""
    if (video.title) {
        type = "video"
    } else {
        type = "channel"
    }

    const play = () => {
        apiCall("GET", "/api/piped/streams", { v: video.id }).then(resp => {
            player.play(resp)
            router.push("/player")
        })
    }

    return <>
        {playlists.length ? <AddToPlaylist songTitle={video.title} songId={video.id} playlists={playlists} open={add[0]} setOpen={add[1]} /> : <></>}
        <Card style={{ position: 'relative' }} onMouseEnter={() => { setCtx(true) }} onMouseLeave={() => { setCtx(false) }} p={0} radius="lg">
            <Group mb="sm" grow direction="column" spacing={0} sx={interactive} onClick={play}>
                <Card.Section mb="sm">
                    <div style={{ display: 'inline-block', overflow: 'hidden', width: '100%' }} className="img-wrapper">
                        <Image height={180} src={video.thumbnail || video.thumbnailUrl} alt={video.title} />
                    </div>
                </Card.Section>
                <Group grow direction="column" spacing={2} px="sm">
                    <Text weight={500} size="lg">
                        {video.title ? video.title : video.name}
                    </Text>
                    {video.uploaderName || video.uploader && <Text size="sm">
                        {video.uploaderName || video.uploader}
                    </Text>}
                </Group>
            </Group>
            <Collapse style={{ bottom: 0, right: 0, position: 'absolute' }} in={touchScreen || ctx}>
                <Group p="sm" position={"right"}>
                    <Menu closeOnScroll control={<UnstyledButton><Action size="md"><Dots size={20} /></Action></UnstyledButton>} shadow="lg" withArrow position="bottom">
                        <Menu.Label>{video.title}</Menu.Label>
                        {playlists.length ? <>
                            <Menu.Item onClick={() => { add[1](true) }} icon={<PlaylistAdd size={14} />}>{localized.addToPlaylist}</Menu.Item>
                            <Divider />
                        </> : <></>}
                        <Menu.Label>{localized.queue}</Menu.Label>
                        <Menu.Item onClick={() => { player.addToQueue(video.id, "first") }} icon={<SortAscending size={14} />}>{localized.playNext}</Menu.Item>
                        <Menu.Item onClick={() => { player.addToQueue(video.id, "last") }} icon={<SortDescending size={14} />}>{localized.playLast}</Menu.Item>
                    </Menu>
                </Group>
            </Collapse>
        </Card>
    </>
}

export const VideoGrid = ({ videos, player, touchScreen, playlists }: any) => {
    if (!videos) { return <></> }
    return (<>
        <Grid>
            {videos.map((video: any, i: number) => {
                if (video.uploaded == -1) return <div key={i}></div>
                return <Grid.Col md={4} span={12} key={i}>
                    <Video playlists={playlists} touchScreen={touchScreen} player={player} video={video} />
                </Grid.Col>
            })}
        </Grid>
    </>)
}