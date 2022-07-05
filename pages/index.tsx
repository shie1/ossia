import { Container, Group, Loader, TextInput, Text, Paper, Center, Divider, ActionIcon, Button, Affix } from '@mantine/core'
import { useEventListener, useWindowScroll } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, Dots, Search } from 'tabler-icons-react'
import { Action } from '../components/action'
import { useLoading } from '../components/loading'
import { localized } from '../components/localization'
import { usePiped } from '../components/piped'
import { VideoGrid } from '../components/video'

const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [results, setResults] = useState<any>({})
  const [searching, setSearching] = useState(false)
  const sie = useRef<HTMLInputElement | null>(null)
  const [scroll, scrollTo] = useWindowScroll()
  const loading = useLoading()
  const piped = usePiped()

  const search = (e: any) => {
    e.preventDefault()
    if (!searchInput) { return }
    loading.start()
    piped.api("search", { 'q': searchInput }).then(resp => {
      setResults(resp)
      sie.current!.blur()
      loading.stop()
    })
  }

  const loadMore = useCallback(() => {
    if (!searchInput) { return }
    loading.start()
    piped.api("search", { 'q': searchInput, "nextpage": results.nextpage }).then(resp => {
      let newResults = resp
      newResults.items = [...results.items, ...resp.items]
      setResults(newResults)
      loading.stop()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, results, searchInput])

  useEffect(() => {
    if (results.items && (Math.round(scroll.y) + document.documentElement.clientHeight >= document.documentElement.offsetHeight)) {
      loadMore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll])

  const SearchResults = () => {
    if (!results.items) return <></>
    return (<div>
      <Divider size="lg" my="md" />
      <VideoGrid videos={results.items} />
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
    <Container>
      <Center>
        <form style={{ 'width': '100%' }} onSubmit={search}>
          <TextInput placeholder={localized.navSearch + "..."} radius="lg" ref={sie} onClick={() => { setResults([]) }} size='lg' value={searchInput} onChange={(e) => { setSearchInput(e.currentTarget.value) }} sx={{ width: '100%' }} variant='filled' rightSection={
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
