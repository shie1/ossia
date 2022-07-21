import { Paper, Group, Image, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { interactive } from "./styles";

export const Song = ({ artist, title, id, image, player, noInteraction }: { artist: string, title: string, id: string, image: string, player: any, noInteraction?: boolean }) => {
    const router = useRouter()
    return (<Paper sx={!noInteraction ? interactive : {}} onClick={() => { if (!noInteraction) { player.quickPlay(id); router.push("/player") } }} p="sm" style={{ width: '100%' }} withBorder>
        <Group>
            <div style={{ display: 'inline-block', overflow: 'hidden', width: 75 }} className="img-wrapper">
                <Image width={75} alt={title} src={image} />
            </div>
            <Group direction="column" spacing={0}>
                <Text size="xl">{title}</Text>
                <Text>{artist}</Text>
            </Group>
        </Group>
    </Paper>)
}