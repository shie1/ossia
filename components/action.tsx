import { Center, Paper, Group, Popover, Text, MantineNumberSize } from "@mantine/core"
import { ActionIcon } from "@mantine/core"
import { ReactNode, useState } from "react"

export const ActionGroup = ({ children, sx }: any) => {
    return (<Center>
        <Paper shadow="sm" radius="lg">
            <Group spacing="sm" direction="row">
                {children}
            </Group>
        </Paper>
    </Center>)
}

export const Action = ({ children, onClick, type, label, position, size, mr }: { mr?: MantineNumberSize, children: ReactNode, onClick?: any, type?: "button" | "submit" | "reset" | undefined, label: ReactNode, position?: "top" | "left" | "bottom" | "right", size?: MantineNumberSize }) => {
    const [opened, setOpened] = useState<boolean>(false)
    return (<Popover
        radius="lg"
        opened={opened}
        onClose={() => { setOpened(false) }}
        withArrow
        mr={mr}
        spacing='sm'
        position={position || "top"}
        target={<ActionIcon type={type} onMouseEnter={() => { setOpened(true) }} onMouseLeave={() => { setOpened(false) }} radius="xl" onClick={onClick} size={size || "xl"} variant="default">
            {children}
        </ActionIcon>}
    >
        {typeof label === 'string' ? <Text size="sm">{label}</Text> : label}
    </Popover>)
}