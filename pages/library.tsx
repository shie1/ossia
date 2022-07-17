import { Avatar, Group, Paper, Text } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { User, UserOff } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { useMe } from "../components/auth";

const Library: NextPage = () => {
    const router = useRouter()
    const me = useMe()
    return (<>
        <Paper p="sm" withBorder>
            <Group position="apart">
                <Group spacing={6}>
                    <Avatar><User /></Avatar>
                    <Text>Logged in as: {me.username}</Text>
                </Group>
                <ActionGroup>
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
    </>)
}

export default Library