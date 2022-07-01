import { Container, TextInput } from '@mantine/core'
import type { NextPage } from 'next'
import { useState } from 'react'
  
const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("")

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

  return (<>
    <Container>
      <TextInput width='100%' variant='filled' onChange={} />
    </Container>
  </>)
}

export default Home
