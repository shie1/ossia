import { Anchor, Text } from '@mantine/core'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { removeCookies } from 'cookies-next'
import { useLocalStorage } from '@mantine/hooks'

const Login: NextPage = () => {
    const [redir, setRedir] = useState("")
    const [logged, setLogged] = useLocalStorage({
        'key': 'logged', 'defaultValue': false
    })
    useEffect(() => {
        if (typeof window !== 'undefined' && !redir) {
            setRedir(document.location.origin)
        }
    }, [redir])
    useEffect(()=>{
        setLogged(false)
    },[setLogged])

    return (
        <>
            <meta httpEquiv="refresh" content={`0;URL='${redir}'`} />
            <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
            <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href={redir}>click here!</Anchor></Text>
        </>
    )
}

export const getServerSideProps = ({ req, res }: any) => {
    removeCookies('auth', { req, res, path: '/' })
    return { 'props': {} }
}

export default Login