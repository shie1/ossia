import { Container, Loader, TextInput } from '@mantine/core'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useLoading } from '../components/loading'

const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [results, setResults] = useState<Array<any>>([])
  const [searching, setSearching] = useState(false)
  const loading = useLoading()

  useEffect(() => {
    const search = (sq: string) => {
      if (!searchInput) { return }
      setSearching(true)
    }
    if (!searchInput) { setResults([]); return }
    const timeoutId = setTimeout(() => search(searchInput), 1000);
    return () => clearTimeout(timeoutId);
  }, [loading, searchInput])

  return (<>
    <Container>
      <TextInput value={searchInput} onChange={(e) => {setSearchInput(e.currentTarget.value)}} width='100%' variant='filled' rightSection={searching && <Loader size='xs' />} />
    </Container>
  </>)
}

export default Home
