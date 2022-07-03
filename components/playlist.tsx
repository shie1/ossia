import { ActionIcon, Chip, Chips, Grid, Modal, Paper, Text, TextInput } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { Plus } from "tabler-icons-react"
import { addSong, inPlaylist, removeSong, songPlaylists, usePlaylist, usePlaylists } from "./library"
import { interactive } from "./styles"

export const PlaylistGrid = ({ playlists }: any) => {
    if (playlists === null) { return <></> }
    if (playlists.length === 0) { return <></> }
    let i = 0
    return (<>
        <Grid>
            {playlists.map((playlist: any) => {
                i++
                return <Grid.Col md={4} span={12} key={i}>
                    <Link href={`/playlist?p=${playlist.replace("playlist-", '')}`}>
                        <Paper radius="lg" tabIndex={0} p='md' sx={interactive}>
                            <Text>{decodeURIComponent(playlist.replace("playlist-", ''))}</Text>
                        </Paper>
                    </Link>
                </Grid.Col>
            })}
        </Grid>
    </>)
}

export const CreatePlaylist = ({ opened, onClose }: any) => {
    const [input, setInput] = useState("")
    const form = useRef<null | HTMLFormElement>(null)
    const router = useRouter()
    const playlists = usePlaylists()
    return (<>
        <Modal
            opened={opened}
            onClose={onClose}
            title="Create playlist"
            size="lg"
            radius="lg"
        >
            <form ref={form} onSubmit={(e) => { e.preventDefault(); playlists.createPlaylist(input); onClose() }}>
                <TextInput required size="lg" value={input} onChange={(e) => { setInput(e.currentTarget.value) }} rightSection={<ActionIcon onClick={() => { form.current!.submit() }} mr="sm" radius="xl" size="lg"><Plus /></ActionIcon>} />
            </form>
        </Modal>
    </>)
}

export const AddToPlaylist = ({ opened, onClose }: any) => {
    const [input, setInput] = useState("")
    const router = useRouter()
    const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
    const [checked, setChecked] = useState(() => {
        if (typeof window === 'undefined') {
            return []
        }
        return songPlaylists(streamDetails)
    })
    const playlists = usePlaylists()
    let i = 0
    return (<>
        <Modal
            opened={opened}
            onClose={onClose}
            title="Add song to playlist"
            size="lg"
            radius="lg"
        >
            <Chips value={checked} multiple>
                {playlists.all.map((playlist: string) => {
                    i++
                    return <Chip onClick={() => {
                        if (!inPlaylist(playlist, streamDetails)) {
                            addSong(playlist, streamDetails)
                            setChecked((old: any) => [...old, playlist])
                        } else {
                            removeSong(playlist, streamDetails)
                            setChecked((old: any) => old.filter((item: any) => item !== playlist))
                        }
                    }} key={i} value={playlist}>{playlist}</Chip>
                })}
            </Chips>
        </Modal>
    </>)
}