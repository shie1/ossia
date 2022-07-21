import { Avatar, Button, Center, Chip, Chips, Group, Modal, Paper, Text, TextInput } from "@mantine/core"
import { showNotification, updateNotification } from "@mantine/notifications"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { Check, X } from "tabler-icons-react"
import { apiCall } from "./api"
import { Icon, useIconSelector } from "./icons"
import { localized } from "./localization"
import { interactive } from "./styles"

export const CreatePlaylist = ({ open }: { open: Array<any> }) => {
    const iconSel = useIconSelector()
    const [error, setError] = useState("")
    const [plName, setPlName] = useState("")
    const router = useRouter()
    return (
        <Modal size="lg" opened={open[0]} onClose={() => { open[1](false) }} title={localized.createPlaylist}>
            {iconSel.modal}
            <form onSubmit={(e) => {
                e.preventDefault()
                if (plName.length === 0) {
                    return setError(localized.createPlaylistNameError2!)
                }
                if (!error) {
                    open[1](false)
                    apiCall("POST", "/api/playlist/create", { playlist: plName, icon: iconSel.icon }).then(resp => {
                        if (resp) {
                            showNotification({ "title": localized.success, icon: <Check />, message: localized.playlistCreateResp })
                            window.dispatchEvent(new Event("ossia-playlist-added"))
                        }
                    })
                }
            }}>
                <Paper withBorder>
                    <Group position="apart" p="sm" noWrap direction="row">
                        <Avatar sx={interactive} onClick={iconSel.open} size="lg"><Icon size={40} icon={iconSel.icon} /></Avatar>
                        <TextInput value={plName} onChange={(e) => {
                            setPlName(e.currentTarget.value)
                            if (!/^(\w|\s){0,100}$/.test(e.currentTarget.value)) { setError(localized.createPlaylistNameError!) } else { setError("") }
                        }} error={error} sx={{ width: '100%' }} size="lg" />
                    </Group>
                </Paper>
                <Center mt="sm">
                    <Button type="submit">{localized.create}</Button>
                </Center>
            </form>
        </Modal>
    );
}

export const Playlists = ({ playlists }: { playlists: Array<any> }) => {
    let key = 0
    return (<Group direction="row" spacing="sm">
        {playlists.map((pl) => {
            key++
            const plid = encodeURIComponent(Buffer.from((pl["id"] + 45).toString()).toString('base64'))
            return (<Link key={key} href={`/playlist?p=${plid}`}>
                <Paper sx={interactive} p="md" withBorder>
                    <Group spacing="sm" direction="row">
                        <Icon size={30} icon={pl["icon_name"]} />
                        <Text>{pl["name"]}</Text>
                    </Group>
                </Paper>
            </Link>)
        })}
    </Group>)
}

export const AddToPlaylist = ({ open, setOpen, playlists, songId, songTitle }: { open: boolean, setOpen: any, playlists: Array<any>, songId: string, songTitle: string }) => {
    let key = 0
    return (<Modal size="xl" title={localized.addToPlaylist} onClose={() => { setOpen(false) }} opened={open}>
        <Group direction="row" spacing="sm">
            {playlists.map((pl) => {
                key++
                return (<Paper onClick={() => {
                    const id = `addingToPlaylist-${(new Date()).getTime()}`
                    setOpen(false)
                    showNotification({ id, title: localized.addingToPlaylist, message: localized.formatString(localized.addingInProgress!, songTitle, pl["name"]), loading: true })
                    apiCall("POST", "/api/playlist/add", { videoid: songId, playlistid: pl["id"] }).then(resp => {
                        if (resp) {
                            updateNotification({ id, title: localized.success, icon: <Check />, message: localized.formatString(localized.addedToPlaylist!, songTitle, pl["name"]) })
                        } else {
                            updateNotification({ id, title: localized.error, icon: <X />, message: localized.formatString(localized.addToPlaylistError!, songTitle, pl["name"]) })
                        }
                    })
                }} key={key} sx={interactive} p="md" withBorder>
                    <Group spacing="sm" direction="row">
                        <Icon size={30} icon={pl["icon_name"]} />
                        <Text>{pl["name"]}</Text>
                    </Group>
                </Paper>)
            })}
        </Group>
    </Modal>)
}