import { ActionIcon, Center, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Trash } from "tabler-icons-react";
import { ActionGroup } from "../components/action";
import { useLibrary } from "../components/library";


const Playlist: NextPage = (props: any) => {
    const modals = useModals()
    const library = useLibrary()
    const router = useRouter()
    console.log(props)
    if (!props.playlistId) {
        return <meta httpEquiv="refresh" content="0;URL=/library" />
    }
    if (!library.playlistExists(props.playlistId)) {
        return <meta httpEquiv="refresh" content="0;URL=/library" />
    }
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
    return (<>
        <ActionGroup>
            <ActionIcon radius="xl" onClick={() => {
                confirm(() => {
                    library.removePlaylist(props.playlistName)
                })
            }} size="xl" variant="default">
                <Trash />
            </ActionIcon>
        </ActionGroup>
    </>)
}

Playlist.getInitialProps = async (ctx) => {
    return { playlistName: ctx.query["p"] || false, playlistId: ctx.query["p"] ? `playlist-${encodeURIComponent(ctx.query["p"] as any)}` : false }
}

export default Playlist