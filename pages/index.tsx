import { Container, Group, TextInput, Center, Divider, ActionIcon, Affix, Button } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import { ArrowUp, Search } from 'tabler-icons-react';
import { Action } from '../components/action'
import { apiCall } from '../components/api';
import { localized } from '../components/localization'
import { VideoGrid } from '../components/video'

const Home: NextPage = (props: any) => {
  const [searchInput, setSearchInput] = useState("")
  const [results, setResults] = useState<any>({})
  const [scroll, scrollTo] = useWindowScroll()

  const search = (e: any) => {
    e.preventDefault()
    if (!searchInput) { return }
    apiCall("GET", "/api/piped/search", { "filter": "videos", "q": searchInput }).then(resp => {
      setResults(resp)
    })
  }

  const loadMore = useCallback(() => {
    if (!searchInput) { return }
    apiCall("GET", "/api/piped/search", { nextpage: results.nextpage, filter: "videos", q: searchInput }).then(resp => {
      let newResults = resp
      newResults.items = [...results.items, ...resp.items]
      setResults(newResults)
    })
  }, [results, searchInput])

  useEffect(() => {
    if (results.items && (Math.round(scroll.y) + document.documentElement.clientHeight >= document.documentElement.offsetHeight)) {
      loadMore()
    }
  }, [scroll])

  const SearchResults = () => {
    if (!results.items) return <></>
    return (<div>
      <Divider size="lg" my="md" />
      <VideoGrid playlists={props.playlists} touchScreen={props.touchScreen} player={props.player} videos={results.items} />
      <Center mt="sm">
        <Button variant='light' onClick={loadMore}>Load more</Button>
      </Center>
    </div>)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener("ossia-title-click", () => {
      setSearchInput("")
      setResults([])
    })
    window.addEventListener("ossia-nav-click", () => {
      setSearchInput("")
      setResults([])
    })
  }

  return (<>
    <Head>
      <title>Search | Ossia</title>
    </Head>
    <Container>
      <Center>
        <form style={{ 'width': '100%' }} onSubmit={search}>
          <TextInput placeholder={localized.navSearch + "..."} radius="lg" onClick={() => { setResults([]) }} size='lg' value={searchInput} onChange={(e) => { setResults([]); setSearchInput(e.currentTarget.value) }} sx={{ width: '100%' }} variant='filled' rightSection={
            <Group mr="md">
              <Action label={localized.navSearch} onClick={() => { search(new Event("")) }} >
                <Search />
              </Action>
            </Group>
          } />
        </form>
      </Center>
      <SearchResults />
    </Container>
    {scroll.y > 500 && <Affix>
      <ActionIcon radius="lg" onClick={() => { scrollTo({ x: 0, y: 0 }) }} size="xl" variant='outline' mb={70} m="sm">
        <ArrowUp />
      </ActionIcon>
    </Affix>}
  </>)
}

export default Home
