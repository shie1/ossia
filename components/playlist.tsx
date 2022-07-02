import { Grid, Paper, Text } from "@mantine/core"
import Link from "next/link"
import { interactive } from "./styles"

export const PlaylistGrid = ({ playlists }: any) => {
    if (playlists.length === 0) { return <></> }
    let i = 0
    return (<>
        <Grid>
            {playlists.map((playlist: any) => {
                i++
                return <Grid.Col md={4} span={12} key={i}>
                    <Link href={`/playlist?p=${playlist.replace("playlist-",'')}`}>
                        <Paper p='md' sx={interactive}>
                            <Text>{decodeURIComponent(playlist.replace("playlist-",''))}</Text>
                        </Paper>
                    </Link>
                </Grid.Col>
            })}
        </Grid>
    </>)
}