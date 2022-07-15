import { Card, Grid, Image, Text, AspectRatio } from "@mantine/core"
import { interactive } from "./styles"

export const Video = ({ video }: any) => {
    if (!video) { return <></> }
    let type = ""
    if (video.title) {
        type = "video"
    } else {
        type = "channel"
    }
    const play = () => {
        console.log(`Play: ${video}`)
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

export const VideoGrid = ({ videos }: any) => {
    if (!videos) { return <></> }
    let i = 0
    return (<>
        <Grid>
            {videos.map((video: any) => {
                i++
                if (video.uploaded == -1) return <></>
                return <Grid.Col md={4} span={12} key={i}>
                    <Video video={video} />
                </Grid.Col>
            })}
        </Grid>
    </>)
}