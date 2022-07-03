import { Center, Paper, Group, Popover, Text } from "@mantine/core"
import { ActionIcon } from "@mantine/core"
import { useState } from "react"

export const ActionGroup = ({ children }: any) => {
    return (<Center>
        <Paper radius="lg">
            <Group spacing="sm" direction="row">
                {children}
            </Group>
        </Paper>
    </Center>)
}

export const Action = ({ children, onClick, label, position }: any) => {
    const [opened, setOpened] = useState<boolean>(false)
    return (<Popover
        radius="lg"
        opened={opened}
        onClose={() => { setOpened(false) }}
        withArrow
        spacing='sm'
        position={position || "top"}
        target={<ActionIcon onMouseEnter={() => { setOpened(true) }} onMouseLeave={() => { setOpened(false) }} radius="xl" onClick={onClick} size="xl" variant="default">
            {children}
        </ActionIcon>}
    >
        {typeof label === 'string' ? <Text size="sm">{label}</Text> : label}
    </Popover>)
}