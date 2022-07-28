import { Paper, Group, Image, Text, Center } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { X } from "tabler-icons-react";
import { Action, ActionGroup } from "./action";
import { interactive } from "./styles";

export const Song = ({ index, artist, title, id, image, player, type, children }: { children?: ReactNode, index?: number, artist: string, title: string, id: string, image: string, player: any, type?: "link" | "queue" }) => {
    type = type || "link"
    const router = useRouter()
    return (<Paper sx={type === "link" ? interactive : {}} onClick={type === "link" ? () => { player.quickPlay(id).then(() => { router.push("/player") }) } : () => { }} p="sm" style={{ width: '100%' }} withBorder>
        <Group direction="row" position="apart">
            <Group noWrap direction="row">
                <Image width={50} alt={title} src={image} />
                <Group direction="column" spacing={0}>
                    <Text size="xl">{title}</Text>
                    <Text>{artist}</Text>
                </Group>
            </Group>
            {children}
        </Group>
    </Paper>)
}