import { ActionIcon, Center, Container, Space, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Pencil, Trash } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { usePlaylist, usePlaylists } from "../components/library";
import { localized } from "../components/localization";
import { RenamePlaylist } from "../components/playlist";
import { VideoGrid } from "../components/video";

const Playlist: NextPage = (props: any) => {
    const modals = useModals()
    const router = useRouter()
    const playlists = usePlaylists()
    const [renamePl, setRenamePl] = useState(false)
    const pl = usePlaylist(router.query['p'] as any)
    const confirm = (callback: any) => {
        modals.openConfirmModal({
            title: localized.deletePlaylist,
            children: (
                <Text size="sm">
                    {localized.deletePlaylistModalText}
                </Text>
            ),
            labels: { confirm: localized.delete, cancel: localized.cancel },
            onConfirm: callback,
        });
    }
    return (<Container>
        <RenamePlaylist playlist={router.query['p']} opened={renamePl} onClose={()=>{setRenamePl(false)}} />
        <ActionGroup>
            <Action label={localized.delete} onClick={() => {
                confirm(() => {
                    playlists.removePlaylist(router.query['p'] as any)
                    router.replace("/library")
                })
            }}>
                <Trash />
            </Action>
            <Action label={localized.rename} onClick={() => {
                setRenamePl(true)
            }}>
                <Pencil />
            </Action>
        </ActionGroup>
        <Space h='md' />
        <VideoGrid videos={pl.state[0]} />
    </Container>)
}

export default Playlist