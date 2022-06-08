import { Card, Container, Divider, Group, Loader, Text, TextInput, Title, Button, Image, Badge, SimpleGrid, Space } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import type { NextPage } from 'next'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import { MetaTags } from '../functions';

const Home: NextPage = () => {
  const [searchQuery, setQuery] = useState("");
  const [results, setResults] = useState<any>(0)
  const [rss, setRss] = useState<any>(false)

  useHotkeys([['ctrl+K', () => { setResults(0) }],])

  if (typeof window !== 'undefined') {
    document.title = "Ossia"
  }

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
    console.log(results)
    const Duration = ({ duration }: any) => {
      if (!duration) { return <></> }
      return (<Badge color="pink" variant="light">
        {duration}
      </Badge>)
    }
    const Video = ({ video }: any) => {
      return (
        <Card sx={{ cursor: 'pointer', transition: '100ms', ":hover": { transform: 'scale(1.05)' } }} shadow="sm" p="lg" onClick={() => { window.open(`${location.origin}/watch?v=${video.id.videoId}`, '_self') }}>
          <Card.Section>
            <Image src={video.snippet.thumbnails.high.url} alt={video.title} />
          </Card.Section>

          <Group position="apart" mt='sm'>
            <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} weight={500}>{video.title}</Text>
            <Duration duration={video.snippet.duration} />
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

  const getRss = async (rssUrl: string) => {
    if(rss){return}
    if(document.location.origin.indexOf('localhost') != -1){
      rssUrl = "https://rss.com/blog/feed/"
    }
    const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    if (!urlRegex.test(rssUrl)) {
      return;
    }
    const res = await fetch(`https://api.allorigins.win/get?url=${rssUrl}`);
    const { contents } = await res.json();
    const feed = new window.DOMParser().parseFromString(contents, "text/xml");
    const items = feed.querySelectorAll("item");
    const feedItems = [...items].map((el) => ({
      title: el.querySelector("title")?.innerHTML,
      description: el.querySelector("description")?.innerHTML,
      pubDate: el.querySelector("pubDate")?.innerHTML,
    }));
    setRss(feedItems);
  };

  if (typeof window !== 'undefined') {
    getRss("https://ossia.ml/rss.xml")
  }

  const RSSFeed = () => {
    let i = 0
    if (!rss) { return <></> }
    return (
      <div>
        <Divider my='lg' />
        <Title sx={{ fontFamily: 'Comfortaa, sans-serif', fontSize: '1.5em' }} >Updates</Title>
        {rss.map((item: any) => {
          i++
          return (
            <Card my='sm' key={i} shadow="sm" p="md">
              <Text mb='sm' weight={500} size="lg">
                {item.title}
                <Badge color="blue" mx='sm' variant="light">
                  {(new Date(item.pubDate)).toLocaleString()}
                </Badge>
              </Text>
              <Text size="sm" dangerouslySetInnerHTML={{__html: item.description}} />
            </Card>
          );
        })}
      </div>
    )
  }

  return (
    <>
      <MetaTags title="Ossia - YouTube Music Player" description="Ossia is a free to use YouTube client designed for listening to music." image="/preview.png" />
      <TextInput mb='lg' id='searchInput' onSubmit={(event: any) => { setQuery(event.target.value) }} onChange={(event: any) => { setQuery(event.target.value) }} size='md' placeholder="Search for a song" icon={<Search size={14} />} rightSection={<ConditionalLoader />} />
      <SearchResults />
      <Divider my='lg' />
      <Title sx={{ fontFamily: 'Comfortaa, sans-serif', fontSize: '1.5em' }}>About Osssia</Title>
      <Text>Ossia is a free to use YouTube client designed for listening to music.
        This indie project is being made and maintained by Shie1 in its early access stage since 2022-06-05.
      </Text>
      <RSSFeed />
    </>
  )
}

export default Home
