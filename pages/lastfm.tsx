import { ActionIcon, Anchor, Avatar, Badge, Group, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { BrandLastfm } from 'tabler-icons-react'
import { getCookie } from 'cookies-next'
import Login from './login'

const LastFM: NextPage = (props: any) => {

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

    if (!props.auth) {
        const redir = "http://www.last.fm/api/auth/?api_key=070545b595db2dbcacbf07297c2e93e1"
        return (
            <>
                <meta httpEquiv="refresh" content={`5;URL='${redir}'`} />
                <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
                <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href={redir}>click here!</Anchor></Text>
            </>
        )
    }

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

export const getServerSideProps = ({ req, res }: any) => {
    let auth = getCookie('auth', { req, res }) as any || false
    if (auth) { auth = JSON.parse(auth) }
    return { props: { 'auth': auth } };
}

export default LastFM