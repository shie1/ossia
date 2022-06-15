import { Anchor, Text } from '@mantine/core'
import type { NextPage } from 'next'

const Login: NextPage = () => {
    const redir = "http://www.last.fm/api/auth/?api_key=070545b595db2dbcacbf07297c2e93e1"
    return (
        <>
            <meta httpEquiv="refresh" content={`5;URL='${redir}'`} />
            <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
            <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href={redir}>click here!</Anchor></Text>
        </>
    )
}

export default Login