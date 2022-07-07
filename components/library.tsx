import { Avatar, Button, Center, Group, Modal, Paper, Space, Text, TextInput } from "@mantine/core"
import { useModals } from "@mantine/modals"
import Link from "next/link"
import { useRouter } from "next/router"
import { createElement, ReactNode, useEffect, useRef, useState } from "react"
import { Pencil, Plus, Trash } from "tabler-icons-react"
import { Action, ActionGroup } from "./action"
import { Icon, useIconSelector } from "./icons"
import { localized } from "./localization"
import { compressedLocalStorage } from "./storage"
import { interactive } from "./styles"

export const createPlaylist = (name: string, icon: string) => {
    const pls = JSON.parse(localStorage.getItem("playlists")!)
    localStorage.setItem("playlists", JSON.stringify([...pls, name]))
    const playlistObj: any = {
        'name': name,
        'icon': icon,
        'items': []
    }
    compressedLocalStorage.setItem(`playlist-${pls?.length}`, playlistObj)
}

export const removePlaylist = (name: string) => {
    const pls: Array<string> = JSON.parse(localStorage.getItem("playlists")!)
    localStorage.removeItem(`playlist-${pls.indexOf(name)}`)
    localStorage.setItem("playlists", JSON.stringify(pls.filter(item => item !== name)))
}

export const renamePlaylist = (oldName: string, newName: string, icon: string) => {
    let pls = JSON.parse(localStorage.getItem("playlists")!)
    const pl = compressedLocalStorage.getItem(`playlist-${pls.indexOf(oldName)}`)
    const playlistObj: any = {
        'name': newName,
        'icon': icon,
        'items': pl.items
    }
    compressedLocalStorage.setItem(`playlist-${pls.indexOf(oldName)}`, playlistObj)
    pls[pls.indexOf(oldName)] = newName
    localStorage.setItem("playlists", JSON.stringify(pls))
}

export const getPlaylist = (name: string | number) => {
    if (typeof name === 'string') {
        name = JSON.parse(localStorage.getItem("playlists")!).indexOf(name)
    }
    return compressedLocalStorage.getItem(`playlist-${name}`)
}

export const getPlaylists = () => {
    if (typeof window === 'undefined') { return [] }
    return JSON.parse(localStorage.getItem("playlists")!)
}

export const playlistExists = (name: string) => {
    return JSON.parse(localStorage.getItem("playlists")!).filter((item: string) => item === name).length >= 1
}

const validatePlaylistName = (input: string) => {
    let error: any = false
    if (!input || (input.match(/^\s*$/) !== null)) {
        error = localized.createPlaylistModalNameError0
        return false
    }
    if (input.match(/^[a-zA-Z0-9\s]*$/) === null) {
        error = localized.createPlaylistModalNameError1
        return false
    }
    if (playlistExists(input)) {
        error = localized.createPlaylistModalNameError2
        return false
    }
    return error
}

export const Playlist = ({ name, icon, id }: { name: string, icon: any, id: number }) => {
    return (<>
        <Link href={`/playlist?p=${id}`}>
            <Paper sx={interactive} p="sm" withBorder radius="lg">
                <Group noWrap spacing="sm" direction="row">
                    <Avatar><Icon icon={icon} /></Avatar>
                    <Text>{name}</Text>
                </Group>
            </Paper>
        </Link>
    </>)
}

export const PlaylistDisp = ({ name, icon }: { name: string, icon: any }) => {
    const modals = useModals()
    const router = useRouter()
    const rnD = useState(false)
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
    return (<>
        <Paper p="sm" withBorder radius="lg">
            <RenamePlaylistModal state={rnD} plstring={name} />
            <Group position="apart">
                <Group noWrap spacing="sm" direction="row">
                    <Avatar><Icon icon={icon} /></Avatar>
                    <Text>{name}</Text>
                </Group>
                <ActionGroup>
                    <Action onClick={() => { rnD[1](true) }} label={localized.rename}>
                        <Pencil />
                    </Action>
                    <Action onClick={() => { confirm(() => { removePlaylist(name); router.replace("/library") }) }} label={localized.delete}>
                        <Trash />
                    </Action>
                </ActionGroup>
            </Group>
        </Paper>
    </>)
}

export const Playlists = () => {
    let i = 0
    return (<Group direction="row">
        {getPlaylists().map((playlist: any) => {
            playlist = getPlaylist(playlist)
            i++
            return (<Playlist id={i - 1} key={i} name={playlist.name} icon={playlist.icon} />)
        })}
    </Group>)
}

export const CreatePlaylistModal = ({ state }: { state: any }) => {
    const iconSelector = useIconSelector()
    const [input, setInput] = useState("")
    const [error, setError] = useState("")
    const action = () => {
        setError(validatePlaylistName(input))
        if (error) { return false }
        createPlaylist(input.replace(/\s*$/, ''), iconSelector.icon)
        state[1](false)
    }
    return (<Modal
        opened={state[0]}
        onClose={() => { state[1](false) }}
        title={localized.createPlaylist}
        size="lg"
        radius="lg"
    >
        {iconSelector.modal}
        <form onSubmit={(e) => {
            e.preventDefault()
            action()
        }}>
            <Paper mb="sm" p="sm" withBorder radius="lg">
                <Group noWrap spacing="sm" direction="row">
                    <Avatar size="lg" sx={interactive} onClick={iconSelector.open}><Icon size={35} icon={iconSelector.icon} /></Avatar>
                    <TextInput value={input} onChange={(e) => { setInput(e.currentTarget.value.replace(/[\s*]{2,}/g, ' ').replace(/^\s*/, '')) }} size="lg" style={{ width: '100%' }} />
                </Group>
            </Paper>
            <Center>
                <Button onClick={() => { action() }} variant="light" leftIcon={<Plus />}>{localized.create}</Button>
            </Center>
        </form>
    </Modal>)
}

export const RenamePlaylistModal = ({ state, plstring }: { state: any, plstring: string }) => {
    const iconSelector = useIconSelector()
    const [input, setInput] = useState("")
    const [error, setError] = useState("")
    const [pl, setPl] = useState<any>()
    const router = useRouter()
    useEffect(() => {
        if (!pl) {
            setPl(getPlaylist(plstring))
            iconSelector.setIcon(getPlaylist(plstring).icon)
        }
    }, [pl])
    const action = () => {
        setError(validatePlaylistName(input))
        if (error) { return false }
        renamePlaylist(plstring, input.replace(/\s*$/, ''), iconSelector.icon)
        state[1](false)
    }
    return (<Modal
        opened={state[0]}
        onClose={() => { state[1](false) }}
        title={localized.renamePlaylist}
        size="lg"
        radius="lg"
    >
        {iconSelector.modal}
        <form onSubmit={(e) => {
            e.preventDefault()
            action()
            router.replace(router.asPath)
        }}>
            <Paper mb="sm" p="sm" withBorder radius="lg">
                <Group noWrap spacing="sm" direction="row">
                    <Avatar size="lg" sx={interactive} onClick={iconSelector.open}><Icon size={35} icon={iconSelector.icon} /></Avatar>
                    <TextInput value={input} onChange={(e) => { setInput(e.currentTarget.value.replace(/[\s*]{2,}/g, ' ').replace(/^\s*/, '')) }} size="lg" style={{ width: '100%' }} />
                </Group>
            </Paper>
            <Center>
                <Button onClick={() => { action() }} variant="light" leftIcon={<Pencil />}>{localized.rename}</Button>
            </Center>
        </form>
    </Modal>)
}