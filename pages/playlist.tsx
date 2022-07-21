import { Avatar, Container, Group, Paper, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlayerPlay, Trash } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { Icon } from "../components/icons";
import { localized } from "../components/localization";

const Playlist: NextPage = (props: any) => {
    const [loading, setLoading] = props.loading
    const router = useRouter()
    const [pl, setPl] = useState<any>(null)

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
                                console.log(pl.content)
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
        </Container>
    </>)
}

export default Playlist