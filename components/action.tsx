import { Center, Paper, Group } from "@mantine/core"

export const ActionGroup = ({ children }: any) => {
    return (<Center>
        <Paper radius="lg">
            <Group spacing="sm" direction="row">
                {children}
            </Group>
        </Paper>
    </Center>)
}