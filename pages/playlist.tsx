import { Avatar, Box, Container, Group, Image, Paper, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { CaretDown, CaretUp, PlayerPlay, Trash } from "tabler-icons-react";
import { Action, ActionGroup } from "../components/action";
import { apiCall } from "../components/api";
import { Icon } from "../components/icons";
import { localized } from "../components/localization";
import { arrayMove, defaultTheme, OrderGroup, OrderItem, useOrder } from "react-draggable-order";
import { interactive } from "../components/styles";
import { useForceUpdate } from "../components/react";

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
                                props.player.pop()
                                props.player.queue[1]([])
                                const idlist = mySort(pl.content).map((item: any) => item.id)
                                for await (let id of idlist) {
                                    await props.player.addToQueue(id, "last", false)
                                }
                            }}>
                                <PlayerPlay />
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
                        </>}
                    </ActionGroup>
                </Group>
            </Paper>
            <Group mt="md" grow>
                <OrderGroup mode="between" style={{ width: '100%' }}>
                    {pl && mySort(pl.content).map((song: any, i: number) => {
                        return (<OrderItem
                            key={i}
                            index={i}
                            onMove={(to) => {
                                let newPl = pl
                                newPl.content[to].index = i
                                newPl.content[i].index = to
                                newPl.content = mySort(newPl.content)
                                setPl(newPl)
                                forceUpdate()
                                apiCall("POST", "/api/playlist/reorder", { playlistid: Number(Buffer.from(router.query['p'] as string, "base64")) - 45, from: i + 1, to: to + 1 })
                            }}
                        >
                            <Paper withBorder>
                                <Group noWrap spacing={6} direction="row">
                                    <OrderItem.Handle {...defaultTheme.handle} style={{ height: '100%' }}>
                                        <Box ml={6} sx={((theme) => ({ width: 25, height: '100%', background: theme.colors.dark[9], borderRadius: '40%' }))}>
                                            <Group sx={interactive} position="center" align="center" spacing={0} direction="column">
                                                <CaretUp />
                                                <CaretDown />
                                            </Group>
                                        </Box>
                                    </OrderItem.Handle>
                                    <Group {...defaultTheme.content} sx={interactive} style={{ width: '100%' }} py="sm" grow>
                                        <Group direction="row" position="apart">
                                            <Group direction="row">
                                                <div style={{ display: 'inline-block', overflow: 'hidden', width: 50 }} className="img-wrapper">
                                                    <Image width={50} alt={song.title} src={song.image} />
                                                </div>
                                                <Group direction="column" spacing={0}>
                                                    <Text size="xl">{song.title}</Text>
                                                    <Text>{song.author}</Text>
                                                </Group>
                                            </Group>
                                        </Group>
                                    </Group>
                                </Group>
                            </Paper>
                            <Space h="sm" />
                        </OrderItem>)
                    })}
                </OrderGroup>
                {/* {pl && mySort(pl.content).map((song: any, i: number) => {
                    return (<Song artist={song.author} title={song.title} id={song.id} image={song.image} player={props.player} key={i} />)
                })} */}
            </Group>
        </Container>
    </>)
}

export default Playlist