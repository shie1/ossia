import { Card, Collapse as MCollapse, Grid, Group, Paper, Text, Image, Badge, ActionIcon, Menu, Box, Button, BackgroundImage, Center, Avatar, Space } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { PlayerPause, PlayerPlay } from "tabler-icons-react";

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
                <Center>
                    <Group direction="column" style={{ width: '100%' }} mx='md' p='md'>
                        {children}
                    </Group>
                </Center>
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

export const Meta = ({ pageTitle, title, image, description, type, og, children }: any) => {
    let moreOgTags = ""
    if (og) {
        for (let item in og) {
            moreOgTags = moreOgTags + `<meta property="${item}" content="${og[item]}">`
        }
    }
    return (<Head>
        {title || pageTitle ? <title>{pageTitle || title}</title> : <></>}

        {title ? <>
            <meta itemProp="name" content={title} />
            <meta property="og:title" content={title} />
            <meta name="twitter:title" content={title} />
        </> : <></>}

        <meta property="og:type" content={type || 'website'} />

        {description ? <>
            <meta name="description" content={description} />
            <meta itemProp="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="twitter:description" content={description} />
        </> : <></>}

        {image ? <>
            <meta itemProp="image" content={image} />
            <meta property="og:image" content={image} />
            <meta name="twitter:image" content={image} />
        </> : <></>}

        {og ? <div dangerouslySetInnerHTML={{ __html: moreOgTags }} /> : <></>}

        {children}
    </Head>)
}

export const LFMSong = ({ song, type }: any) => {
    const More = () => {
        switch (type) {
            case 'recents':
                return <>
                    <Group position="right" pt='sm' sx={(theme) => ({ borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.white : theme.black}` })}>
                        <Text size="sm">{song.date ? (moment(moment.utc(song.date[0]['_']).toDate()).local().fromNow()) : 'Now playing'}</Text>
                    </Group>
                </>
            case 'top':
                return <>
                    <Group position="right" pt='sm' direction="row" sx={(theme) => ({ borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.white : theme.black}` })}>
                        <Text size="sm">{song.playcount[0]} plays</Text>
                    </Group>
                </>
            default:
                return <></>
        }
    }
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({ 'key': 'current-low-quality-mode', 'defaultValue': false })
    if (!song) { return <></> }
    return (<>
        <Paper sx={interactivePaper} m={-6} p='sm'>
            <Group mb='sm' direction="row">
                <Avatar>{song.name[0].substring(0, 2)}</Avatar>
                <Group style={{ maxWidth: '80%' }} spacing={0} direction="column">
                    <Text sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box' }} size="lg">{song.name[0]}</Text>
                    <Text sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box' }} size="md">{song.artist[0].name ? song.artist[0].name : (song.artist[0] as any)['_']}</Text>
                </Group>
            </Group>
            <More/>
        </Paper>
    </>)
}