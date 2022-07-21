import { Avatar, Container, Group, Paper, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlayerPlay, Trash } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { Icon } from "../components/icons";
import { localized } from "../components/localization";
import { Song } from "../components/song";

const mySort = (list: Array<any>, backwards = false) => {
    let f = list
    f.sort((a: any, b: any) => {
        if (a.index > b.index) { return 1 } else { return -1 }
    })
    if (backwards) { f.reverse() }
    return f
}

const Playlist: NextPage = (props: any) => {
    const [loading, setLoading] = props.loading
    const router = useRouter()
    const [pl, setPl] = useState<any>(null)
    let key = 0

    useEffect(() => {
        if (typeof window !== undefined && typeof router.query['p'] !== 'undefined' && !pl) {
            setLoading(true)
            apiCall("POST", "/api/playlist/get", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45 }).then(resp => {
                setPl(resp)
                setLoading(false)
            })
        }
    }, [pl, router])

    return (<>
        <Container>
            <Paper p="sm" withBorder>
                <Group position="apart">
                    <Group direction="row" noWrap spacing="sm">
                        {pl && <>
                            <Avatar><Icon size={30} icon={pl.icon} /></Avatar>
                            <Text>{pl.name}</Text>
                        </>}
                    </Group>
                    <ActionGroup>
                        {typeof router.query['p'] !== "undefined" && pl && <>
                            <Action label={localized.play} onClick={() => {
                                props.player.pop()
                                props.player.queue[1]([])
                                mySort(pl.content, true).map((item: any) => { props.player.addToQueue(item.id, "first", false) })
                            }}>
                                <PlayerPlay />
                            </Action>
                            <Action onClick={() => {
                                apiCall("POST", "/api/playlist/delete", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45 }).then(resp => {
                                    if (resp) {
                                        router.replace("/library")
                                        showNotification({ "title": localized.success, "icon": <Trash />, "message": localized.playlistDeleted })
                                    }
                                })
                            }} label={localized.deletePlaylist}>
                                <Trash />
                            </Action>
                        </>}
                    </ActionGroup>
                </Group>
            </Paper>
            <Group mt="md">
                {pl && mySort(pl.content).map((song: any) => {
                    key++
                    return (<Song artist={song.author} title={song.title} id={song.id} image={song.image} player={props.player} key={key} />)
                })}
            </Group>
        </Container>
    </>)
}

export default Playlist