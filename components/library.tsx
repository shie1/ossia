import { useCompressedLocalStorage } from "./storage"

export const useLibrary = () => {
    const compressedLocalStorage = useCompressedLocalStorage()
    function createPlaylist(playlist: string) {
        compressedLocalStorage.setItem(`playlist-${encodeURIComponent(playlist)}`, [])
    }
    function removePlaylist(playlist: string) {
        if (typeof window === 'undefined') return
        localStorage.removeItem(`playlist-${encodeURIComponent(playlist)}`)
    }
    function addSong(playlist: string, songDetails: any) {
        const pl = compressedLocalStorage.getItem(`playlist-${encodeURIComponent(playlist)}`)
        const songObject = {
            'title': songDetails.title,
            'uploader': songDetails.uploader,
            'thumbnailUrl': songDetails.thumbnailUrl,
            'duration': songDetails.duration
        }
        compressedLocalStorage.setItem(`playlist-${encodeURIComponent(playlist)}`, [...pl, songObject])
    }
    return {'createPlaylist': createPlaylist, 'removePlaylist': removePlaylist, 'addSong': addSong}
}