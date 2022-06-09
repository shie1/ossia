import { Button, PasswordInput, Textarea, TextInput } from '@mantine/core'
import type { NextPage } from 'next'

const Post: NextPage = () => {
  return (
    <>
      <form method='POST' action='/api/rsswrite' target='_blank'>
        <PasswordInput
          placeholder="Password"
          label="Password"
          name='password'
          mb='sm'
          required
        />
        <TextInput
          label="Title"
          placeholder="Title"
          name='title'
          mb='sm'
          required
        />
        <TextInput
          label="Category"
          placeholder="Category"
          name='category'
          mb='sm'
          required
        />
        <Textarea
          placeholder="Content"
          label="Content"
          name='content'
          mb='sm'
          required
        />
        <Button onClick={()=>{
          document.querySelector('form')?.requestSubmit()
        }}>Submit</Button>
      </form>
    </>
  )
}

export default Post