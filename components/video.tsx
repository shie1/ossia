import { Card, Grid, Image, Text, AspectRatio } from "@mantine/core"
import { useRouter } from "next/router"
import { apiCall } from "./api"
import { interactive } from "./styles"

export const Video = ({ video, player }: any) => {
    const router = useRouter()
    if (!video) { return <></> }
    let type = ""
    if (video.title) {
        type = "video"
    } else {
        type = "channel"
    }
    const play = () => {
        apiCall("GET", "/api/piped/streams", { v: (video.thumbnail || video.thumbnailUrl).split("/")[4] }).then(resp => {
            player.play(resp)
            router.push("/player")
        })
    }
    return <>
        <Card radius="lg" sx={interactive} onClick={play}>
            <Card.Section mb="sm">
                <div style={{ display: 'inline-block', overflow: 'hidden', width: '100%' }} className="img-wrapper">
                    <Image height={160} src={video.thumbnail || video.thumbnailUrl} alt={video.title} />
                </div>
            </Card.Section>
            <Text mb={2} weight={500} size="lg">
                {video.title ? video.title : video.name}
            </Text>
            {video.uploaderName || video.uploader && <Text size="sm">
                {video.uploaderName || video.uploader}
            </Text>}
        </Card>
    </>
}

export const VideoGrid = ({ videos, player }: any) => {
    if (!videos) { return <></> }
    let i = 0
    return (<>
        <Grid>
            {videos.map((video: any) => {
                i++
                if (video.uploaded == -1) return <></>
                return <Grid.Col md={4} span={12} key={i}>
                    <Video player={player} video={video} />
                </Grid.Col>
            })}
        </Grid>
    </>)
}