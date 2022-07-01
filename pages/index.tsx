import { Container, Group, Loader, TextInput, Text, Paper, Center, Divider } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'tabler-icons-react'
import { useLoading } from '../components/loading'
import { usePiped } from '../components/piped'
import { VideoGrid } from '../components/video'

const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [results, setResults] = useState<Array<any>>([])
  const [searching, setSearching] = useState(false)
  const [scroll, scrollTo] = useWindowScroll()
  const loading = useLoading()
  const piped = usePiped()
  const resultsRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    const search = (sq: string) => {
      if (!searchInput) { return }
      piped.api("search", { 'q': searchInput }).then(resp => {
        setResults(resp.items)
      })
    }
    if (!searchInput) { setResults([]); return }
    const timeoutId = setTimeout(() => search(searchInput), 1000);
    return () => clearTimeout(timeoutId);
  }, [searchInput, searching])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (((window.innerHeight + scroll.y) >= document.body.offsetHeight) && (results.length !== 0)) {
        console.log("bottom")
      }
    }
  }, [scroll, results])

  const SearchResults = () => {
    if (!results) return <></>
    return (<div ref={resultsRef}>
      <Divider size="lg" my="md" />
      <VideoGrid videos={results} />
    </div>)
  }

  return (<>
    <Container>
      <Center>
        <TextInput size='lg' value={searchInput} onChange={(e) => { setSearchInput(e.currentTarget.value) }} sx={{ width: '100%' }} variant='filled' rightSection={searching && <Loader size='xs' />} />
      </Center>
      <SearchResults />
    </Container>
  </>)
}

export default Home
