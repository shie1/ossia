import { Card, Collapse as MCollapse, Grid, Group, Paper, Text, Image, Badge, ActionIcon, Menu, Box, Button, BackgroundImage, Center } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { PlayerPlay } from "tabler-icons-react";

export const Collapse = ({ icon, title, children }: any) => {
    const [open, setOpen] = useState<boolean>(false)
    return (<>
        <Paper sx={{ width: '100%' }}>
            <Paper onClick={() => { setOpen(!open) }} className="pagePaper" shadow='lg' withBorder>
                <Group p='md' sx={interactivePaper}>
                    {icon}
                    <Text>{title}</Text>
                </Group>
            </Paper>
            <MCollapse in={open}>
                <Group direction="column" style={{ width: '100%' }} mx='md' p='md'>
                    {children}
                </Group>
            </MCollapse>
        </Paper>
    </>)
}

export const interactivePaper = (theme: any) => ({ borderRadius: '10px', cursor: 'pointer', '&:hover': { 'color': theme.colors[theme.primaryColor][Number(theme.primaryShade)], backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.light[2] } })

export const Video = ({ title, thumbnail, author, length, id }: any) => {
    return (<>
        <Link prefetch={false} href={`/song?v=${id}`}>
            <Card
                shadow="sm"
                p="xl"
                className="videoCard"
                onSelect={(e: any) => { e.preventDefault() }}
            >
                <Card.Section>
                    <BackgroundImage className="image" src={thumbnail}>
                        <Center sx={{ height: 160, backdropFilter: 'brightness(.9)', cursor: 'pointer' }}>
                            <PlayerPlay className="icon" style={{ filter: 'drop-shadow(0 0 5px black) drop-shadow(0 0 5px black)', stroke: 'white', strokeWidth: '2px' }} size={40} />
                        </Center>
                    </BackgroundImage>
                </Card.Section>

                <Text style={{ position: 'relative' }} mt='sm' weight={500} size="lg">
                    <Group sx={{ left: 0, width: '80%' }} className="title" direction="row">
                        <span style={{ marginRight: '.4em' }}>{title}</span>
                        <Badge>{length}</Badge>
                    </Group>
                </Text>

                {author ? <Text size="sm">
                    {author}
                </Text> : <></>}
            </Card>
        </Link>
    </>)
}

export const VideoGrid = ({ videos }: any) => {
    if (videos.length === 0) { return <></> }
    let i = 0
    return (
        <Grid grow>
            {videos.map((video: any) => {
                i++
                let span = 4
                if (i % 2 == 0) { span = 3 }
                return (
                    <Grid.Col md={span} key={i} span={12}><Video title={video.title} length={video.length} thumbnail={video.thumbnail} id={video.id} author={video.author} /></Grid.Col>
                )
            })}
        </Grid>
    )
}

export const Player = ({ video }: any) => {
    if (!video) { return <Text>No video playing!</Text> }
    return <>

    </>
}