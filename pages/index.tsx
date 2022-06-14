import { Card, Container, Divider, Group, Loader, Text, TextInput, Title, Button, Image, Badge, SimpleGrid, Space, Tabs, ActionIcon, Paper, AspectRatio } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { InfoCircle, Note, Search, X } from 'tabler-icons-react'
import { MetaTags, setSong } from '../functions';

const Home: NextPage = () => {
  const [searchQuery, setQuery] = useState("");
  const [results, setResults] = useState<any>(0)
  const [rss, setRss] = useState<any>(false)
  const [gotRss, setGotRss] = useState<boolean>(false)
  const [lqmode, setLQMode] = useLocalStorage({
    'key': 'lowQualityMode',
    'defaultValue': 1
  })

  useHotkeys([['ctrl+K', () => { setResults(0) }],])

  useEffect(() => {
    const search = (query: string) => {
      setResults(1)
      const rb = JSON.stringify({ query: query })
      fetch(`${document.location.origin}/api/search`, { 'method': 'POST', 'body': rb }).then(async response => {
        setResults(await response.json())
      })
    }

    if (!searchQuery) { setResults(0); return }
    const timeoutId = setTimeout(() => search(searchQuery), 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const ConditionalLoader = () => {
    if (results == 1) {
      return <Loader size="xs" />;
    }
    return <></>;
  }

  const SearchResults = () => {
    let i = 0
    if (typeof results != 'object') { return <></>; }
    const Video = ({ video }: any) => {
      return (
        <Card sx={{ cursor: 'pointer', transition: '100ms', ":hover": { transform: 'scale(1.05)' } }} shadow="sm" p="lg" onClick={() => { setSong(video.id.videoId) }}>
          <Card.Section>
            <AspectRatio ratio={1280 / 720}>
              <Image src={video.snippet.thumbnails.high.url} alt={video.title} />
            </AspectRatio>
          </Card.Section>

          <Group position="apart" mt='sm'>
            <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} weight={500}>{video.title}</Text>
            <Badge color="pink" variant="light">
              {video.snippet.duration}
            </Badge>
          </Group>
        </Card>
      )
    }
    return (
      <ul style={{ all: 'unset' }}>
        <SimpleGrid cols={3} spacing='sm' breakpoints={[
          { maxWidth: 925, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}>
          {results.map((item: any) => {
            if (!item.duration_raw) { return <></> }
            i++
            return (
              <li style={{ all: 'unset' }} key={i}>
                <Video video={item} />
              </li>
            );
          })}
        </SimpleGrid>
      </ul>
    )
  }

  const getRss = (rssUrl: string) => {
    if (gotRss) { return }
    setGotRss(true)
    fetch(`${document.location.origin}/api/rss`, { method: 'POST', body: JSON.stringify({ 'rss': rssUrl }) }).then(async resp => { setRss((await resp.json()).rss) })
  };

  if (typeof window !== 'undefined') {
    getRss(`${document.location.origin}/rss.xml`)
  }

  const RSSFeed = () => {
    let i = 0
    if (!rss) { return <></> }
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          {rss.channel[0].item.map((item: any) => {
            i++
            return (
              <Card className='rss' my={6} key={i} shadow="sm" p="md">
                <Text mb='sm' weight={500} size="lg">
                  <Group spacing='sm' direction="row">
                    <span>
                      {item.title}
                    </span>
                    <Badge color="blue" variant="light">
                      {item.category}
                    </Badge>
                  </Group>
                </Text>
                <Text mb='sm' size="sm" dangerouslySetInnerHTML={{ __html: item.description }} />
                <Text sx={{ opacity: '.7' }} size='xs'>Posted on: {(new Date(item.pubDate)).toLocaleString()}</Text>
              </Card>
            );
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <MetaTags title="Ossia - YouTube Music Player" description="Ossia is a free to use YouTube client designed for listening to music." image="/preview.png" />
      <TextInput mb='sm' id='searchInput' onSubmit={(event: any) => { setQuery(event.target.value) }} onChange={(event: any) => { setQuery(event.target.value) }} size='md' placeholder="Search for a song" icon={<Search size={14} />} rightSection={<ConditionalLoader />} />
      <SearchResults />
      <Divider my='lg' />
      <Tabs>
        <Tabs.Tab label="About" icon={<InfoCircle />}>
          <Paper withBorder p='sm' mt='sm'>
            Ossia is a free to use YouTube client designed for listening to music.
            This indie project is being made and maintained by Shie1 in its early access stage since 2022-06-05.
          </Paper>
        </Tabs.Tab>
        <Tabs.Tab label="Blog" icon={<Note />}>
          <RSSFeed />
        </Tabs.Tab>
      </Tabs>
    </>
  )
}

export default Home
