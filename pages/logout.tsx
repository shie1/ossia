import type { NextPage } from "next";
import { useRouter } from "next/router";
import { removeCookies } from "cookies-next"
import { Anchor, Text } from "@mantine/core";

export const Logout: NextPage = () => {
    const router = useRouter()
    return (<>
        <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
        <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href="/">click here!</Anchor></Text>
        <meta httpEquiv="refresh" content="0;URL='/'" />
    </>)
}

export async function getServerSideProps({ req, res }: any) {
    removeCookies('auth', { req, res, path: '/' })
    return {
        props: {},
    }
}

export default Logout