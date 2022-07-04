import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Anchor, Text } from "@mantine/core";

export const Login: NextPage = (props: any) => {
    const router = useRouter()
    const redir = props.env.NODE_ENV === 'production' ? "http://www.last.fm/api/auth/?api_key=070545b595db2dbcacbf07297c2e93e1" : "https://www.last.fm/api/auth?api_key=070545b595db2dbcacbf07297c2e93e1&cb=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback"
    router.replace(redir)
    return (<>
        <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
        <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href={redir}>click here!</Anchor></Text>
    </>)
}

export const getServerSideProps = ({ req, res }: any) => {
    require('dotenv').config()
    return { props: { 'env': process.env } };
}

export default Login