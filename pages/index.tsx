import { Container, TextInput } from '@mantine/core'
import type { NextPage } from 'next'
import { useState } from 'react'
  
const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("")

  return (<>
    <Container>
      <TextInput width='100%' variant='filled'/>
    </Container>
  </>)
}

export default Home
