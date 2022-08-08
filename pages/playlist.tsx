import { Avatar, Box, Collapse, Container, Group, Image, Paper, Space, Text, Transition } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Adjustments, CaretDown, CaretUp, Hourglass, Lock, PlayerPlay, Trash, World, X } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { Icon } from "../components/icons";
import { localized } from "../components/localization";
import { arrayMove, defaultTheme, OrderGroup, OrderItem, useOrder } from "react-draggable-order";
import { interactive } from "../components/styles";
import { useForceUpdate } from "../components/react";
import Head from "next/head";

const mySort = (list: Array<any>, backwards = false) => {
    let f = list
    f.sort((a: any, b: any) => {
        if (a.index > b.index) { return 1 } else { return -1 }
    })
    if (backwards) { f.reverse() }
    return f
}

const Playlist: NextPage = (props: any) => {
    const [loading, setLoading] = props.loading
    const router = useRouter()
    const [pl, setPl] = useState<any>(null)
    const forceUpdate = useForceUpdate()
    const [moving, setMoving] = useState(-1)

    useEffect(() => {
        if (typeof window !== undefined && typeof router.query['p'] !== 'undefined' && !pl) {
            setLoading(true)
            apiCall("POST", "/api/playlist/get", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45 }).then(resp => {
                setPl(resp)
                setLoading(false)
            })
        }
    }, [pl, router])

    return (<>
        <Container>
            <Head>
                <title>{pl ? `${pl.name} | Ossia` : "Playlist | Ossia"}</title>
            </Head>
            <Paper p="sm" withBorder>
                <Group position="apart">
                    <Group direction="row" noWrap spacing="sm">
                        {pl && <>
                            <Avatar><Icon size={30} icon={pl.icon} /></Avatar>
                            <Text>{pl.name}</Text>
                        </>}
                    </Group>
                    <ActionGroup>
                        {typeof router.query['p'] !== "undefined" && pl && <>
                            <Action label={localized.play} onClick={async () => {
                                setLoading(true)
                                props.player.pop()
                                props.player.queue[1]([])
                                const idlist = mySort(pl.content).map((item: any) => item.id)
                                let cycles = 0
                                let brf = false
                                window.addEventListener("ossia-pop-player", () => {
                                    brf = true
                                })
                                for await (let id of idlist) {
                                    if (!brf) {
                                        await props.player.addToQueue(id, "last", false)
                                        if (cycles === 0) {
                                            setLoading(false)
                                            router.push("/player")
                                        }
                                        cycles++
                                    }
                                }
                            }}>
                                <PlayerPlay />
                            </Action>
                            {pl.author === props.me.username ? <>
                                <Action label={pl.ispublic ? localized.toPrivate : localized.toPublic} onClick={() => {
                                    let newPl = pl
                                    newPl.ispublic = !pl.ispublic
                                    setPl(newPl)
                                    forceUpdate()
                                    console.log(newPl.ispublic)
                                    apiCall("POST", "/api/playlist/visibility", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45, plpublic: newPl.ispublic })
                                }}>
                                    {!pl.ispublic ? <Lock /> : <World />}
                                </Action>
                                <Action onClick={() => {
                                    apiCall("POST", "/api/playlist/delete", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45 }).then(resp => {
                                        if (resp) {
                                            router.replace("/library")
                                            showNotification({ "title": localized.success, "icon": <Trash />, "message": localized.playlistDeleted })
                                        }
                                    })
                                }} label={localized.deletePlaylist}>
                                    <Trash />
                                </Action>
                            </> : <></>}
                        </>}
                    </ActionGroup>
                </Group>
            </Paper>
            <Group mt="md" grow direction="column">
                {pl && mySort(pl.content).map((song: any, i: number) => {
                    return (<Group direction="row" noWrap key={i}>
                        {pl.author === props.me.username ?
                            <Collapse style={{ width: 50 }} in={moving === i}>
                                <ActionGroup>
                                    <Action label={localized.delete} onClick={() => {
                                        showNotification({ 'title': '...', 'icon': <Hourglass />, 'message': '' })
                                        return
                                        let newPl = pl
                                        newPl.content = newPl.content.filter((item: any) => item.index !== i + 1)
                                        newPl.content = mySort(newPl.content)
                                        setPl(newPl)
                                        setMoving(-1)
                                        forceUpdate()
                                        apiCall("POST", "/api/playlist/remove", { id: Number(Buffer.from(router.query['p'] as string, "base64")) - 45, index: i + 1 })
                                    }}>
                                        <Trash />
                                    </Action>
                                </ActionGroup>
                            </Collapse>
                            : <></>}
                        <Paper sx={{ width: '100%' }} withBorder>
                            <Group noWrap spacing={6} direction="row">
                                {pl.author === props.me.username ?
                                    <Box onClick={() => {
                                        if ([-1, i].includes(moving)) {
                                            setMoving(moving === i ? -1 : i)
                                        } else {
                                            let newPl = pl
                                            newPl.content[i].index = moving + 1
                                            newPl.content[moving].index = i + 1
                                            newPl.content = mySort(newPl.content)
                                            setPl(newPl)
                                            setMoving(-1)
                                            forceUpdate()
                                            apiCall("POST", "/api/playlist/reorder", { playlistid: Number(Buffer.from(router.query['p'] as string, "base64")) - 45, from: i + 1, to: moving + 1 })
                                        }
                                    }} ml={6} sx={((theme) => ({ width: 25, height: '100%', background: theme.colors.dark[9], borderRadius: '40%' }))}>
                                        <Group sx={interactive} position="center" align="center" spacing={0} direction="column">
                                            <CaretUp />
                                            <CaretDown />
                                        </Group>
                                    </Box>
                                    : <Space w={5} />}
                                <Group onClick={() => {
                                    props.player.quickPlay(song.id, true)
                                }} {...defaultTheme.content} sx={interactive} style={{ width: '100%' }} py="sm" grow>
                                    <Group direction="row" position="apart">
                                        <Group noWrap direction="row">
                                            <Image height={50} width={50} alt={song.title} src={song.image} />
                                            <Group direction="column" spacing={0}>
                                                <Text size="xl">{song.title}</Text>
                                                <Text>{song.author}</Text>
                                            </Group>
                                        </Group>
                                    </Group>
                                </Group>
                            </Group>
                        </Paper>
                    </Group>)
                })}
                {/* {pl && mySort(pl.content).map((song: any, i: number) => {
                    return (<Song artist={song.author} title={song.title} id={song.id} image={song.image} player={props.player} key={i} />)
                })} */}
            </Group>
        </Container>
    </>)
}

export default Playlist