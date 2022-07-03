import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useApi } from "../components/api";
import { useCookies } from "react-cookie"
import { apiroot } from "../components/lastfm";
import { Avatar } from "@mantine/core";

export const User: NextPage = () => {
    const router = useRouter()
    const [cookies, setCookies, removeCookies] = useCookies(["auth"])
    const user = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getInfo", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })
    const recentTracks = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getRecentTracks", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })
    const topTracks = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getTopTracks", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })

    return (<>
        <Avatar src={user?.lfm.user[0].image[user?.lfm.user[0].image.length-1]['_']}>{user?.lfm.user[0].realname[0].substring(0,2)}</Avatar>
    </>)
}

export default User;