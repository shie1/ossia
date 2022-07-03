import { ActionIcon, Center, Container, Modal, Space, Text, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import { ActionGroup } from "../components/action";
import { usePlaylists } from "../components/library";
import { PlaylistGrid, CreatePlaylist } from "../components/playlist";

const Library: NextPage = () => {
    const playlists = usePlaylists()
    const router = useRouter()
    const [crModal, setCrModal] = useState(false)

    return (<>
        <CreatePlaylist opened={crModal} onClose={() => { setCrModal(false) }} />
        <Container>
            <ActionGroup>
                <ActionIcon radius="xl" size="xl" variant="default" onClick={() => { setCrModal(true) }}>
                    <Plus />
                </ActionIcon>
            </ActionGroup>
            <Space h="sm" />
            <PlaylistGrid playlists={playlists.all} />
        </Container>
    </>)
}

export default Library