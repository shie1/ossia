import { Avatar, Container, Group, Paper, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus, User, UserOff } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { useMe } from "../components/auth";
import { localized } from "../components/localization";
import { CreatePlaylist } from "../components/playlist";

const Library: NextPage = () => {
    const router = useRouter()
    const createModal = useState<boolean>(false)
    const me = useMe()
    return (<Container>
        <CreatePlaylist open={createModal} />
        <Head>
            <title>{localized.navLibrary} | Ossia</title>
        </Head>
        <Paper p="sm" withBorder>
            <Group position="apart">
                <Group spacing={6}>
                    <Avatar><User /></Avatar>
                    <Text>Logged in as: {me.username}</Text>
                </Group>
                <ActionGroup>
                    <Action onClick={()=>{createModal[1](true)}} label={localized.createPlaylist}>
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
    </Container>)
}

export default Library