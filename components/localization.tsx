import { useLocalStorage } from '@mantine/hooks';
import LocalizedStrings from 'react-localization';

export const localized = new LocalizedStrings({
    en: {
        navSearch: "Search",
        navPlayer: "Player",
        navLibrary: "Library",
        createPlaylist: "Create playlist",
        createPlaylistModalNameError0: "Playlist name can not be empty!",
        createPlaylistModalNameError1: "Playlist name can not contain special characters!",
        createPlaylistModalNameError2: "This playlist already exists!",
        deletePlaylist: "Delete playlist",
        deletePlaylistModalText: "Are you sure you want to delete this playlist? This action can not be undone.",
        setLang: "Change the application's display language.",
        renamePlaylist: "Rename playlist",
        endPlayback: "End playback",
        addToPlaylist: "Add to playlist",
        confirm: "Confirm",
        cancel: "Cancel",
        create: "Create",
        delete: "Delete",
        rename: "Rename",
        playlist: "Playlist",
        play: "Play",
        pause: "Pause",
        settings: "Settings",
        lang: "Language",
        appNameAppend: `Music Player`,
        description: "Description",
        related: "Related",
        linkLastFM: "Link Last.FM",
        unlinkLastFM: "Unlink Last.FM",
        linkLastFMText: "Link your Last.FM account with Ossia and scrobble your songs.",
        unlinkLastFMText: "Unlink your Last.FM account.",
        linkLastFMButton: "Link Account",
        unlinkLastFMBUtton: "Unlink account",
        openInLastFM: "Open in Last.FM",
        friends: "Friends",
        recentTracks: "Recent tracks",
        topTracks: "Top tracks",
        nothingHere: "Nothing here...",
        selectIcon: "Select icon",
        wip: "Under development...",
        about: "About",
        aboutTitle: "About Ossia",
        aboutText: "The Ossia Music player is an open source project, made by Shie1.\nThe project has started {time}.",
        plays: "plays",
        nowPlaying: "Now playing",
        dependencies: "Dependencies",
        contributors: "Contributors",
        germanContrib: "German translations",
        newTabTitle: "Open URL in new tab",
        newTabText: "You're about to open a link from {href} in a new tab.\nAre you sure? This page is not related to Ossia.",
        muted: "Muted",
        low: "Low",
        medium: "Medium",
        high: "High"
    },
    hu: {
        navSearch: "Keresés",
        navPlayer: "Lejátszó",
        navLibrary: "Könyvtár",
        createPlaylist: "Lejátszási lista létrehozása",
        createPlaylistModalNameError0: "A lejátszási lista neve nem lehet üres!",
        createPlaylistModalNameError1: "A lejátszási lista neve nem tartalmazhat speciális karaktereket!",
        createPlaylistModalNameError2: "Ez a lejátszási lista már létezik!",
        deletePlaylist: "Lejátszási lista törlése",
        deletePlaylistModalText: "Biztos törölni szeretnéd ezt a lejátszási listát? Ezt a műveletet nem tudod utólag visszavonni.",
        setLang: "Az alkalmazás megjelenítési nyelvének megváltoztatása.",
        renamePlaylist: "Lejátszási lista átnevezése",
        endPlayback: "Megszakítás",
        addToPlaylist: "Hozzáadás listához",
        confirm: "Megerősítés",
        cancel: "Mégse",
        create: "Létrehozás",
        delete: "Törlés",
        rename: "Átnevezés",
        playlist: "Lejátszási lista",
        play: "Lejátszás",
        pause: "Szünet",
        settings: "Beállítások",
        lang: "Nyelv",
        appNameAppend: "Zenelejátszó",
        description: "Leírás",
        related: "Javaslatok",
        linkLastFM: "Last.FM csatolása",
        unlinkLastFM: "Last.FM leválasztása",
        linkLastFMText: "Csatold a Last.FM fiókodat az Ossia-hoz és naplózd a hallgatási előzményeidet.",
        unlinkLastFMText: "Last.FM fiók leválasztása",
        linkLastFMButton: "Fiók csatolása",
        unlinkLastFMBUtton: "Fiók leválasztása",
        openInLastFM: "Megnyitás Last.FM-ben.",
        friends: "Barátok",
        recentTracks: "Korábbi dalok",
        topTracks: "Legyakoribb dalok",
        nothingHere: "Ez üres...",
        selectIcon: "Ikon kiválasztása",
        wip: "Fejlesztés alatt...",
        about: "Részletek",
        aboutTitle: "Az Ossia-ról",
        aboutText: "Az Ossia Zenelejátszó egy nyílt forráskódú projekt, amit Shie1 készít.\nA projekt {time} kezdődött.",
        plays: "hallgatás",
        nowPlaying: "Lejátszás alatt",
        dependencies: "Függelékek",
        contributors: "Közreműködők",
        germanContrib: "Almalmazás lefordítása német nyelvre",
        newTabTitle: "Link megnyitása új lapon",
        newTabText: "Új lapon készülsz megnyitni egy linket innen: {href}\nBiztos vagy benne? Ez az oldal nem kapcsolódik az Ossia-hoz.",
        muted: "Néma",
        low: "Alacsony"
        medium: "Közepes"
        high: "Magas"
    }
});