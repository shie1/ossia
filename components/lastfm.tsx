import { unescape } from 'querystring'
import md5 from 'md5'
import { useCookies } from "react-cookie"
import { DefaultValue } from '@mantine/core/lib/components/MultiSelect/DefaultValue/DefaultValue'
import useSWR from "swr";
import superagent from "superagent"
import { Avatar, Group, Paper, Text } from '@mantine/core';
import { interactive } from './styles';
import { useLocalStorage } from '@mantine/hooks';
import moment from 'moment';
const parser = require('superagent-xml2jsparser')

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const apiroot = "http://ws.audioscrobbler.com/2.0/"

export const genSig = (json: any, env: any) => {
    let sig = ""
    const keys = Object.keys(json)
    keys.sort()
    for (const item of keys) {
        sig = sig + item + json[item]
    }
    json['api_sig'] = md5(unescape(encodeURIComponent(sig + env.LASTFM_SECRET)))
    return json
}

export const useLastFM = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['auth']);
    if (!cookies.auth) { return { 'cookie': false } }
    return { 'cookie': cookies.auth }
}