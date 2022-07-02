import { ActionIcon, Center, Container, Modal, Space, Text, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import { ActionGroup } from "../components/action";
import { useLibrary } from "../components/library";
import { PlaylistGrid } from "../components/playlist";

const Library: NextPage = () => {
    const library = useLibrary()
    const router = useRouter()
    const [crModal, setCrModal] = useState(false)

    const CreatePlaylist = () => {
        const [input, setInput] = useState("")
        return (<>
            <Modal
                opened={crModal}
                onClose={() => setCrModal(false)}
                title="Create playlist"
                size="lg"
                radius="lg"
            >
                <form onSubmit={(e) => { e.preventDefault(); library.createPlaylist(input); router.push(`/playlist?p=${encodeURIComponent(input)}`) }}>
                    <TextInput required size="lg" value={input} onChange={(e) => { setInput(e.currentTarget.value) }} rightSection={<ActionIcon mr="sm" radius="xl" size="lg"><Plus /></ActionIcon>} />
                </form>
            </Modal>
        </>)
    }

    return (<>
        <CreatePlaylist />
        <Container>
            <ActionGroup>
                <ActionIcon radius="xl" size="xl" variant="default" onClick={() => { setCrModal(true) }}>
                    <Plus />
                </ActionIcon>
            </ActionGroup>
            <Space h="sm" />
            <PlaylistGrid playlists={library.playlists()} />
        </Container>
    </>)
}

export default Library