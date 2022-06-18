import { Loader, Button, Container, Group, Space, Text, TextInput, Collapse, Divider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { getCookie } from "cookies-next";
import type { NextPage } from "next"
import { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import { VideoGrid } from "../components";

const SearchSection = () => {
    const [searching, setSearching] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<Array<object>>([])
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({ 'key': 'current-low-quality-mode', 'defaultValue': false })

    useEffect(() => {
        const search = (sq: string) => {
            if (!sq) { return }
            setSearching(true)
            const rb = JSON.stringify({ query: query })
            fetch(`${document.location.origin}/api/search`, { 'method': 'POST', 'body': rb }).then(async response => {
                let resp = await response.json()
                let vids: any = []
                resp.map((video: any) => {
                    if(!video["duration_raw"]){return}
                    vids.push({ 'id': video.id.videoId, 'title': video.title, 'author': '', 'thumbnail': currentLQ ? video.snippet.thumbnails.default.url : video.snippet.thumbnails.high.url, 'length': video["duration_raw"] })
                })
                console.log(vids)
                setResults(vids)
                setSearching(false)
            })
        }
        const timeoutId = setTimeout(() => search(query), 1000);
        return () => clearTimeout(timeoutId);
    }, [query, currentLQ])

    const Results = () => {
        return (
            <Collapse in={results.length !== 0}>
                <Divider my='sm' />
                <Space h={2} />
                <VideoGrid videos={results} />
            </Collapse>
        )
    }

    return (<>
        <TextInput
            placeholder="Search"
            icon={<Search />}
            sx={{ width: '100%' }}
            size='md'
            rightSection={searching ? <Loader size='xs' mr='sm' /> : <></>}
            value={query}
            onChange={(e) => { setQuery(e.currentTarget.value) }}
        />
        <Results/>
    </>)
}

const Index: NextPage = (props: any) => {
    return (<>
        <Container>
            <SearchSection />
        </Container>
    </>)
}

export const getServerSideProps = ({ req, res }: any) => {
    let auth = getCookie('auth', { req, res }) as any || false
    if (auth) { auth = JSON.parse(auth) }
    return { props: { 'auth': auth } };
}

export default Index;