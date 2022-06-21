import { Loader, Button, Container, Group, Space, Text, TextInput, Collapse, Divider, Paper, Grid } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { getCookie } from "cookies-next";
import type { NextPage } from "next"
import { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import { LFMSong, VideoGrid } from "../components";

const Index: NextPage = (props: any) => {
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
        fetch(`${document.location.origin}/api/youtube/search`, { 'method': 'POST', 'body': rb }).then(async response => {
          let resp = await response.json()
          let vids: any = []
          resp.map((video: any) => {
            if (!video["duration_raw"]) { return }
            vids.push({ 'id': video.id.videoId, 'title': video.title, 'author': '', 'thumbnail': currentLQ ? video.snippet.thumbnails.default.url : video.snippet.thumbnails.high.url, 'length': video["duration_raw"] })
          })
          setResults(vids)
          setSearching(false)
        })
      }
      if (!query) { setResults([]); return }
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
      <Text mb='sm' size="lg">Search</Text>
      <TextInput
        placeholder="Search"
        icon={<Search />}
        size='md'
        variant="default"
        rightSection={searching ? <Loader size='xs' mr='sm' /> : <></>}
        value={query}
        onChange={(e) => { setQuery(e.currentTarget.value) }}
      />
      <Results />
      <Divider my='md' size='xl' />
      {!props.auth ? <>
        <Paper shadow='lg' className='about' withBorder p='sm' mt='sm'>
          <Text mb='sm' size="xl" align="center">About Ossia</Text>
          <Text>The Ossia Music Player is a free to use YouTube client designed for listening to music.</Text>
          <Text>This indie project is being made and maintained by Shie1 since 2022-05-30.</Text>
          <Text mt='md' sx={{ fontWeight: 600 }} size='lg'>Why you should use Ossia:</Text>
          <ul>
            <li>There are no ads on our site.</li>
            <li>We don&apos;t collect user data on the server.</li>
            <li>You can link our player to Last.fm.</li>
            <li>Ossia is a PWA (Progressive Web App) which means you can download it to your phone as an app, from your browser.</li>
          </ul>
        </Paper></> : <>
      </>}
    </>)
  }

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