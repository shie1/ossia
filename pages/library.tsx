import { Avatar, Box, Container, Group, Paper, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CloudDownload, Plus, User, UserOff } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { localized } from "../components/localization";
import { CreatePlaylist, ImportPlaylist, Playlists } from "../components/playlist";

const Library: NextPage = (props: any) => {
    const [loading, setLoading] = props.loading
    const router = useRouter()
    const createModal = useState(false)
    const importModal = useState(false)
    const playlists = props.playlists
    const me = props.me
    useEffect(() => {
        if (!me && playlists === null) { setLoading(true) } else { setLoading(false) }
    }, [me, playlists])
    return (<Container>
        <CreatePlaylist open={createModal} />
        <ImportPlaylist open={importModal} />
        <Head>
            <title>Library | Ossia</title>
        </Head>
        <Paper p="sm" withBorder>
            <Group position="apart">
                <Group spacing="sm">
                    <Avatar><User /></Avatar>
                    <Text>{localized.formatString(localized.loggedInAs!, me.username || "")}</Text>
                </Group>
                <ActionGroup>
                    <Action onClick={() => { importModal[1](true) }} label={localized.import}>
                        <CloudDownload />
                    </Action>
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