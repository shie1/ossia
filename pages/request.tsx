import { Button, Divider, JsonInput, Text, TextInput } from '@mantine/core'
import type { NextPage } from 'next'
import { useState } from 'react'
import { load } from 'ts-dotenv'

const env = load({
  LASTFM_KEY: String,
  LASTFM_SECRET: String,
  NODE_ENV: [
    'production' as const,
    'development' as const,
  ],
})

const Api: NextPage = (props: any) => {
  const [reqUrl, setReqUrl] = useState("")
  const [reqBody, setReqBody] = useState("")
  const [response, setResp] = useState("")

  if (!props.dev) {
    return <meta httpEquiv="refresh" content={`5;URL='https://ossia.ml'`} />
  }

  const submit = async () => {
    setResp(await (await fetch(reqUrl, { 'method': 'POST', 'body': reqBody })).json())
  }

  return (
    <>
      <TextInput mb='sm' label="Request URL" placeholder='https://domain.org/api/endpoint' onChange={(e) => { setReqUrl(e.currentTarget.value) }} value={reqUrl} />
      <JsonInput mb='sm' formatOnBlur autosize label="Request body" onChange={setReqBody} value={reqBody} />
      <Button onClick={submit}>Submit</Button>
      {response ?
        <>
          <Divider my='sm' />
          <JsonInput value={JSON.stringify(response)} />
        </> :
        <></>}
    </>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  let dev = false
  if (env.NODE_ENV === 'development') {
    dev = true
  }
  return { 'props': { 'dev': dev } }
}

export default Api