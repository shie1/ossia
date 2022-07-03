import { ActionIcon, Center, Container, Modal, Space, Text, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { usePlaylists } from "../components/library";
import { localized } from "../components/localization";
import { PlaylistGrid, CreatePlaylist } from "../components/playlist";

const Library: NextPage = () => {
    const playlists = usePlaylists()
    const router = useRouter()
    const [crModal, setCrModal] = useState(false)

    return (<>
        <CreatePlaylist opened={crModal} onClose={() => { setCrModal(false) }} />
        <Container>
            <ActionGroup>
                <Action onClick={() => { setCrModal(true) }} label={localized.create}>
                    <Plus />
                </Action>
            </ActionGroup>
            <Space h="sm" />
            <PlaylistGrid playlists={playlists.all} />
        </Container>
    </>)
}

export default Library