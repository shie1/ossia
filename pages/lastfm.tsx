import { ActionIcon, Avatar, Badge, Group, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { BrandLastfm } from 'tabler-icons-react'

const LastFM: NextPage = () => {
    const [user, setUser] = useState<any>()
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })

    useEffect(() => {
        if (!user) {
            fetch(`${document.location.origin}/api/lastfm/me`).then(async (resp: any) => {
                setUser((await resp.json()).lfm.user[0])
            })
        }
    }, [user])

    return (
        <>
            <Group direction='row'>
                <Avatar radius="xl" src={user?.image[(currentLQ) ? 0 : user.image.length - 1]['_']} />
                <Text size='xl'>{user?.realname[0] ? `${user?.realname} (${user?.name})` : user?.name}</Text>
                <Badge>{user?.country[0]}</Badge>
                <ActionIcon component='a' target='_blank' href={user?.url[0]}>
                    <BrandLastfm />
                </ActionIcon>
            </Group>
        </>
    )
}

export default LastFM