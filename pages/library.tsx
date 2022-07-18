import { Accordion, AccordionItem, Avatar, Box, Container, Group, Paper, Space, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Playlist, Plus, User, UserOff } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { useMe } from "../components/auth";
import { localized } from "../components/localization";
import { CreatePlaylist, Playlists } from "../components/playlist";

const Library: NextPage = () => {
    const [loading, setLoading] = useLocalStorage({ key: "loading", defaultValue: false })
    const router = useRouter()
    const createModal = useState<boolean>(false)
    const [playlists, setPlaylists] = useState<Array<any> | null>(null)
    const me = useMe()
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
                    }} label="Sign out">
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