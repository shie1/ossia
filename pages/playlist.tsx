import { ActionIcon, Center, Container, Space, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Trash } from "tabler-icons-react";
import { ActionGroup } from "../components/action";
import { usePlaylist, usePlaylists } from "../components/library";
import { VideoGrid } from "../components/video";

const Playlist: NextPage = (props: any) => {
    const modals = useModals()
    const router = useRouter()
    const playlists = usePlaylists()
    const pl = usePlaylist(router.query['p'] as any)
    console.log(pl.state[0])
    const confirm = (callback: any) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Text size="sm">
                    This action is so important that you are required to confirm it with a modal. Please click
                    one of these buttons to proceed.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: callback,
        });
    }
    return (<Container>
        <ActionGroup>
            <ActionIcon radius="xl" onClick={() => {
                confirm(() => {
                    playlists.removePlaylist(router.query['p'] as any)
                    router.push("/library")
                })
            }} size="xl" variant="default">
                <Trash />
            </ActionIcon>
        </ActionGroup>
        <Space h='md' />
        <VideoGrid videos={pl.state[0]} />
    </Container>)
}

export default Playlist