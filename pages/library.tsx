import { Avatar, Box, Container, Group, Paper, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, User, UserOff } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { localized } from "../components/localization";
import { CreatePlaylist, Playlists } from "../components/playlist";

const Library: NextPage = (props: any) => {
    const [loading, setLoading] = props.loading
    const router = useRouter()
    const createModal = useState<boolean>(false)
    const [playlists, setPlaylists] = useState<Array<any> | null>(null)
    const me = props.me
    useEffect(() => {
        if (!me && playlists === null) { setLoading(true) } else { setLoading(false) }
    }, [me, playlists])

    useEffect(() => {
        apiCall("GET", "/api/user/playlists", {}).then(resp => {
            setPlaylists(resp)
        })
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener("ossia-playlist-added", () => {
                apiCall("GET", "/api/user/playlists", {}).then(resp => {
                    setPlaylists(resp)
                })
            })
        }
    }, [])
    return (<Container>
        <CreatePlaylist open={createModal} />
        <Head>
            <title>{localized.navLibrary} | Ossia</title>
        </Head>
        <Paper p="sm" withBorder>
            <Group position="apart">
                <Group spacing="sm">
                    <Avatar><User /></Avatar>
                    <Text>{localized.formatString(localized.loggedInAs!, me.username || "")}</Text>
                </Group>
                <ActionGroup>
                    <Action onClick={() => { createModal[1](true) }} label={localized.createPlaylist}>
                        <Plus />
                    </Action>
                    <Action onClick={() => {
                        apiCall("GET", "/api/user/logout", {}).then(() => {
                            router.replace("/")
                        })
                    }} label={localized.logout}>
                        <UserOff />
                    </Action>
                </ActionGroup>
            </Group>
        </Paper>
        <Text size="xl" mt="md">{localized.myPlaylists}</Text>
        <Box mt="sm">
            {playlists && <Playlists playlists={playlists} />}
        </Box>
    </Container>)
}

export default Library