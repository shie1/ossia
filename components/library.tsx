import { useLocalStorage } from "@mantine/hooks"
import LZString from "lz-string"
import { useEffect, useState } from "react"
import { compressedLocalStorage, useCompressedLocalStorage } from "./storage"

export const addSong = (playlist: string, streamDetails: any) => {
    const pl = compressedLocalStorage.getItem(`playlist-${encodeURIComponent(playlist)}`)
    const songObject = {
        'title': streamDetails.title,
        'uploader': streamDetails.uploader,
        'thumbnailUrl': streamDetails.thumbnailUrl,
        'duration': streamDetails.duration,
        'id': streamDetails.thumbnailUrl.split("/")[4]
    }
    compressedLocalStorage.setItem(`playlist-${encodeURIComponent(playlist)}`, [...pl, songObject])
}

export const removeSong = (playlist: string, streamDetails: any) => {
    const pl = compressedLocalStorage.getItem(`playlist-${encodeURIComponent(playlist)}`)
    const newpl = pl.filter((item: any) => item.id !== streamDetails.thumbnailUrl.split("/")[4])
    compressedLocalStorage.setItem(`playlist-${encodeURIComponent(playlist)}`, newpl)
}

export const playlistExists = (playlist: string) => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(`playlist-${encodeURIComponent(playlist)}`) !== null
}

export const inPlaylist = (playlist: string, streamDetails: any) => {
    if (typeof window === 'undefined') { return [] }
    const pl = compressedLocalStorage.getItem(`playlist-${encodeURIComponent(playlist)}`)
    return pl.filter((item: any) => item.id === streamDetails.thumbnailUrl.split("/")[4]).length > 0
}

export const songPlaylists = (streamDetails: any) => {
    if (typeof window === 'undefined') { return [] }
    let res = []
    for (let pl of JSON.parse(localStorage.getItem("playlists")!)) {
        if (inPlaylist(pl, streamDetails)) { res.push(pl) }
    }
    return res
}

export const usePlaylists = () => {
    const [playlists, setPlaylists] = useLocalStorage<any>({ 'key': 'playlists', 'defaultValue': [] })
    const createPlaylist = (playlist: string) => {
        compressedLocalStorage.setItem(`playlist-${encodeURIComponent(playlist)}`, [])
        setPlaylists((old: any) => [...old, playlist])
    }
    const removePlaylist = (playlist: string) => {
        localStorage.removeItem(`playlist-${encodeURIComponent(playlist)}`)
        setPlaylists(playlists.filter((item: any) => item !== playlist))
    }
    return { all: playlists, createPlaylist: createPlaylist, removePlaylist: removePlaylist }
}

export const usePlaylist = (playlist: string) => {
    const playlistId = `playlist-${encodeURIComponent(playlist)}`
    const [pl, setPl] = useCompressedLocalStorage({ 'key': playlistId, 'defaultValue': [] })
    const addSong = (streamDetails: any) => {
        const songObject = {
            'title': streamDetails.title,
            'uploader': streamDetails.uploader,
            'thumbnailUrl': streamDetails.thumbnailUrl,
            'duration': streamDetails.duration,
            'id': streamDetails.thumbnailUrl.split("/")[4]
        }
        setPl((old: any) => [...old, songObject])
    }
    const removeSong = (streamDetails: any) => {
        const newpl = pl.filter((item: any) => item.id !== streamDetails.thumbnailUrl.split("/")[4])
        setPl(newpl)
    }
    const findSong = (streamDetails: any) => {
        return pl.filter((item: any) => item.id === streamDetails.thumbnailUrl.split("/")[4]).length > 0
    }
    return { 'state': [pl, setPl], 'addSong': addSong, 'removeSong': removeSong, 'findSong': findSong }
}