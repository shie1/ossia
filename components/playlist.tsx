import { Avatar, Button, Center, Group, Modal, Paper, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useState } from "react"
import { Check } from "tabler-icons-react"
import { apiCall } from "./api"
import { Icon, useIconSelector } from "./icons"
import { localized } from "./localization"
import { interactive } from "./styles"

export const CreatePlaylist = ({ open }: { open: Array<any> }) => {
    const iconSel = useIconSelector()
    const [error, setError] = useState("")
    const [plName, setPlName] = useState("")
    return (
        <Modal size="lg" opened={open[0]} onClose={() => { open[1](false) }} title={localized.createPlaylist}>
            {iconSel.modal}
            <form onSubmit={(e) => {
                e.preventDefault()
                if (plName.length === 0) {
                    return setError("Playlist name cannot be empty!")
                }
                if (!error) {
                    open[1](false)
                    apiCall("POST", "/api/playlist/create", { playlist: plName, icon: iconSel.icon }).then(resp => {
                        if (resp) {
                            showNotification({ "title": "Success!", icon: <Check />, message: "Playlist created successfully!" })
                        }
                    })
                }
            }}>
                <Paper withBorder>
                    <Group position="apart" p="sm" noWrap direction="row">
                        <Avatar sx={interactive} onClick={iconSel.open} size="lg"><Icon size={40} icon={iconSel.icon} /></Avatar>
                        <TextInput value={plName} onChange={(e) => {
                            setPlName(e.currentTarget.value)
                            if (!/^(\w|\s)*$/.test(e.currentTarget.value)) { setError("Playlist name can only contain letters, numbers and spaces.") } else { setError("") }
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