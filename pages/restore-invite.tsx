import { Button, Container, Group, Text, TextInput } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRef, useState } from "react";
import { Clipboard } from "tabler-icons-react";
import { Action } from "../components/action";
import { apiCall } from "../components/api";

const RestoreInvite: NextPage = () => {
    const [orderId, setOrderId] = useState("")
    const form = useRef(null)
    const modals = useModals()
    return (<Container>
        <form onSubmit={async (e) => {
            e.preventDefault()
            apiCall("POST", "/api/restoreinvite", { i: orderId }).then(resp => {
                if (resp) {
                    const reply = modals.openModal({
                        title: "Invite code", children:
                            <Group spacing="sm" grow direction="column">
                                <Group spacing={2} grow direction="column">
                                    <Text>Your code is:</Text>
                                    <TextInput size="lg" rightSection={<Group mr="md"><Action onClick={() => {
                                        window.navigator.clipboard.writeText(resp)
                                        showNotification({ title: "Copied to clipboard!", message: "", icon: <Clipboard /> })
                                    }} label="Copy to clipboard"><Clipboard /></Action></Group>} value={resp} />
                                </Group>
                                <Group spacing={6} position="right">
                                    <Button onClick={() => {
                                        modals.closeModal(reply)
                                    }} variant="light">Close</Button>
                                </Group>
                            </Group>
                    })
                }
            })
        }} ref={form}>
            <TextInput placeholder="8X183i26Jr596b63Y" size="lg" label="Order ID" value={orderId} onChange={(e) => setOrderId(e.currentTarget.value)} />
            <Button mt="sm" type="submit">Restore</Button>
        </form>
    </Container>)
}

export default RestoreInvite