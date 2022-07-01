import { Card, Grid, Image, Text, AspectRatio } from "@mantine/core"

export const Video = ({ video }: any) => {
    if (!video) { return <></> }
    let type = ""
    if (video.title) {
        type = "video"
    } else {
        type = "channel"
    }
    return <>
        <Card>
            <Card.Section mb="sm">
                <Image height={160} src={video.thumbnail} alt={video.title} />
            </Card.Section>
            <Text mb={2} weight={500} size="lg">
                {video.title ? video.title : video.name}
            </Text>
            {video.uploaderName && <Text size="sm">
                {video.uploaderName}
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
                return <Grid.Col md={4} span={12} key={i}>
                    <Video video={video} />
                </Grid.Col>
            })}
        </Grid>
    </>)
}