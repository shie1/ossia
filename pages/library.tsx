import { ActionIcon, Center, Container, Modal, Space, Text, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus, AlertCircle } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { localized } from "../components/localization";
import { wip } from "../components/notifications";

const Library: NextPage = () => {
    const router = useRouter()

    return (<>
        <Container>
            <ActionGroup>
                <Action onClick={wip} label={localized.create}>
                    <Plus />
                </Action>
            </ActionGroup>
            <Space h="sm" />
            <Center>
                <Text>{localized.wip}</Text>
            </Center>
        </Container>
    </>)
}

export default Library