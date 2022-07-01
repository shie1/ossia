import { Card, Grid, Image, Text } from "@mantine/core"

export const Video = ({ video }: any) => {
    if (!video) { return <></> }
    return <>
        <Card>
            <Card.Section>
                <Image src={video.thumbnail} alt={video.title} />
            </Card.Section>
            <Text weight={500} size="lg">
                {video.title}
            </Text>
            <Text size="sm">
                {video.uploaderName}
            </Text>
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