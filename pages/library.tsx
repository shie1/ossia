import { Card, Group, Tabs, Text, Image, SimpleGrid, Badge, Button, ActionIcon, AspectRatio, Popover } from '@mantine/core'
import { Heart, Clock, X } from 'tabler-icons-react'
import type { NextPage } from 'next'
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useModals } from '@mantine/modals';
import { setSong } from '../functions';

const Library: NextPage = () => {
    const [liked, setLiked] = useLocalStorage<Array<any>>(
        { key: 'liked-songs', defaultValue: [] }
    );
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })
    const [history, setHistory] = useLocalStorage<Array<any>>(
        { key: 'history', defaultValue: [] }
    );
    const [likedD, setLikedD] = useState([])
    const [historyD, setHistoryD] = useState([])

    const SongList = ({ list, d, set }: any) => {
        const [po, setPo] = useState(false)
        useEffect(() => {
            const stuff = list
            stuff.sort((a: any, b: any) => {
                return (new Date(b.added)).getTime() - (new Date(a.added)).getTime()
            })
            if (d[0] !== stuff) {
                d[1](stuff)
            }
        }, [d, list])
        let i = 0
        if (d[0].length == 0) {
            return <></>
        }
        return (
            <>
                <Group position='center'>
                    <Popover
                        target={
                            <ActionIcon size='lg' onMouseEnter={() => { setPo(true) }} onMouseLeave={() => { setPo(false) }} onClick={() => { openConfirmModal(() => { set([]) }) }} mb='md'>
                                <X />
                            </ActionIcon>
                        }
                        opened={po}
                        onClose={() => { setPo(false) }}
                        position="bottom"
                        spacing='sm'
                        shadow='xl'
                        withArrow
                    >
                        <Text>Clear</Text>
                    </Popover>
                </Group>
                <SimpleGrid cols={3} spacing='sm' breakpoints={[
                    { maxWidth: 925, cols: 2, spacing: 'sm' },
                    { maxWidth: 600, cols: 1, spacing: 'sm' },
                ]}>
                    {d[0].map((item: any) => {
                        i++
                        if (!item.title) { return <></> }
                        return (
                            <Card key={i} sx={{ cursor: 'pointer', transition: '100ms', ":hover": { transform: 'scale(1.05)' } }} shadow="sm" p="lg" onClick={() => { setSong(item.id,currentLQ) }}>
                                <Card.Section>
                                    <AspectRatio ratio={1280 / 720}>
                                        <Image src={item.thumbnail} alt={item.title} />
                                    </AspectRatio>
                                </Card.Section>

                                <Group position="apart" mt='sm'>
                                    <Text dangerouslySetInnerHTML={{ __html: item.title }} sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} weight={500} />
                                    <Badge color="pink" variant="light">
                                        {(new Date(item.added)).toLocaleString()}
                                    </Badge>
                                </Group>
                            </Card>
                        )
                    })}
                </SimpleGrid>
            </>)
    }

    const modals = useModals();

    const openConfirmModal = (confirm: any) => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                This action is so important that you are required to confirm it with a modal. Please click
                one of these buttons to proceed.
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: confirm,
    });

    return (
        <>
            <Tabs>
                <Tabs.Tab label="Liked" icon={<Heart />}>
                    <SongList list={liked} d={[likedD, setLikedD]} set={setLiked} />
                </Tabs.Tab>
                <Tabs.Tab label="Recent" icon={<Clock />}>
                    <SongList list={history} d={[historyD, setHistoryD]} set={setHistory} />
                </Tabs.Tab>
            </Tabs>
        </>
    )
}

export default Library