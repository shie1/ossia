import type { NextPage } from "next";
import { useRouter } from "next/router";
import { removeCookies } from "cookies-next"

export const Logout: NextPage = () => {
    const router = useRouter()
    router.replace("/")
    return <></>
}

export async function getServerSideProps({ req, res }: any) {
    removeCookies('auth', { req, res, path: '/' })
    return {
        props: {},
    }
}

export default Logout