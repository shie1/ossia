import { Collapse, Group, Paper, Text } from "@mantine/core"
import { useState } from "react"
import { AlertCircle, X } from "tabler-icons-react"
import { Action } from "./action"

export const Alert = ({ title, text }: { title: string, text: string }) => {
    const [open, setOpen] = useState(true)
    const [hover, setHover] = useState(false)
    return (<Collapse mb="sm" in={open}>
        <Paper p="sm" withBorder >
            <Group position="apart" direction='row'>
                <Group direction='row'>
                    <Group onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>
                        <Action onClick={() => { setOpen(false) }}>
                            {hover ? <X size={50} /> : <AlertCircle size={50} />}
                        </Action>
                    </Group>
                    <Group direction='column' spacing={4}>
                        <Text size="xl">{title}</Text>
                        <Text>{text}</Text>
                    </Group>
                </Group>
            </Group>
        </Paper >
    </Collapse>)
}