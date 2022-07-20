import { Group, Paper, Text } from '@mantine/core';
import LocalizedStrings from 'react-localization';
import { AlertCircle } from 'tabler-icons-react';

export const localized = new LocalizedStrings({
    en: {
        navSearch: "Search",
        navPlayer: "Player",
        navLibrary: "Library",
        createPlaylist: "Create playlist",
        createPlaylistNameError: "Playlist name can only contain letters, numbers and spaces.",
        createPlaylistNameError2: "Playlist name cannot be empty!",
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
        aboutText: "The Ossia Music player is an open source project, made by Shie1.\nThe project has started {0}.",
        plays: "plays",
        nowPlaying: "Now playing",
        dependencies: "Dependencies",
        contributors: "Contributors",
        germanContrib: "German translations",
        newTabTitle: "Open URL in new tab",
        newTabText: "You're about to open a link from {0} in a new tab.\nAre you sure? This page is not related to Ossia.",
        muted: "Muted",
        low: "Low",
        medium: "Medium",
        high: "High",
        openInYt: "Open in YouTube",
        error: "Error",
        songErrorText: "Error encountered while trying to load song, please try again!",
        success: "Success!",
        playlistCreateResp: "Playlist created successfully!",
        myPlaylists: "My playlists",
        registerText: "Don't have an account yet?",
        login: "Login",
        logout: "Logout",
        loggedInAs: "Logged in as {0}",
        password: "Password",
        username: "Username",
        inviteCode: "Invite code",
        copiedToClipboard: "Copied to clipboard!",
        copyToClipboard: "Copy to clipboard",
        close: "Close",
        inviteSalesPitch: "With a donation, you can get an invite to register an account and get access to all of the features our application has to offer.",
        orderId: "Order ID",
        restore: "Restore",
        registrationSuccessful: "Registration successful!",
        youMayNowLogin: "You may now log in!",
        register: "Register",
        inviteCodeInvalid: "Invite code invalid!",
        usernameTaken: "Username is taken!",
        usernameDesc: "You can't change this later!",
        passwordDesc: "8 chars\nMust contain lower and upper case\nMust contain a number",
        inviteCodeDesc: "A code you can get from a registered user, or from a donation.",
        buyInviteOpen: "Don't have an invite?",
        buyInviteClose: "Already have an invite?",
        restorePurchase: "Restore purchase",
        backToOrder: "Back to order",
        weakPassword: "This password is too weak!",
        usernameInvalid: "Username can only contain letters and numbers!",
        weaverContrib: "Graphic designs (Logo, 404)\nLocalization assistance (Hungarian)",
        yourCodeIs: "Your code is:",
        orderResp: "Order {0} has been successful, your code is:",
        playlistDeleted: "Playlist deleted!",
        pageNotFound: "Page not found!",
        hungaryText: "Made with {0} from Hungary",
        registerCheckbox: "I am over 18 years old and I have read the {0}.",
        legalSection: "\"Legal\" section",
        sites: "Sites",
        dcs0Contrib: "Hosting services",
        englishOnlyTitle: "Unlocalized page",
        englishOnlyText: "This page is only available in english, we apologize for the inconvenience.",
        legalSectionTitle: "The \"Legal\" section",
        legalSectionText: "Reading these are necessary before registering an account.",
        privacyPolicy: "Privacy Policy",
        invalidLogin: "Invalid username or password",
        accountSettings: "Account Settings",
        changePass: "Change password",
        currentPass: "Current password",
        newPassword: "New password",
        passwordConfirmError: "Passwords did not match!",
        change: "Change",
        cannotBeEmpty: "This field cannot be empty!",
        passwordChangeResp: "Password changed successfully!",
        passwordChangeErr: "The password you entered is incorrect!"
    },
    hu: {
        navSearch: "Keresés",
        navPlayer: "Lejátszó",
        navLibrary: "Könyvtár",
        createPlaylist: "Lejátszási lista létrehozása",
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
        aboutText: "Az Ossia Zenelejátszó egy nyílt forráskódú projekt, amit Shie1 készít.\nA projekt {0} kezdődött.",
        plays: "hallgatás",
        nowPlaying: "Lejátszás alatt",
        dependencies: "Függelékek",
        contributors: "Közreműködők",
        germanContrib: "Almalmazás lefordítása német nyelvre",
        newTabTitle: "Link megnyitása új lapon",
        newTabText: "Új lapon készülsz megnyitni egy linket innen: {0}\nBiztos vagy benne? Ez az oldal nem kapcsolódik az Ossia-hoz.",
        muted: "Néma",
        low: "Alacsony",
        medium: "Közepes",
        high: "Magas",
        openInYt: "Megnyitás YouTube-ban",
        error: "Hiba",
        songErrorText: "A dal betöltése során hiba merült fel, kérlek próbáld újra!",
        loggedInAs: "Bejelentkezve mint: {0}",
        close: "Bezárás",
        buyInviteOpen: "Nincs meghívód?",
        buyInviteClose: "Már van meghívód?",
        copiedToClipboard: "Vágolapra másolva",
        copyToClipboard: "Másolás a vágólapra",
        createPlaylistNameError: "A lejátszási lista neve csak betűket, és számokat tartalmazhat!",
        createPlaylistNameError2: "A lejátszási lista neve nem lehet üres!",
        inviteCode: "Meghívó",
        inviteCodeDesc: " Egy kód amit egy regisztrált felhasználótól kaphatsz, vagy adományból.",
        inviteCodeInvalid: "A meghívó érvénytelen!",
        inviteSalesPitch: "Egy adománnyal szerezhetsz meghívót és regisztrálhatsz az Ossia-ra és hozzáférést kaphatsz az összes funkcióhoz amit az applikációnk kínál.",
        login: "Bejelentkezés",
        logout: "Kijelentkezés",
        myPlaylists: "Lejátszási listák",
        orderId: "Rendelési azonosító",
        password: "Jelszó",
        passwordDesc: "8 karakter\nTartalmazzon kis- és nagybetűt\nTartalmazzon számot.",
        playlistCreateResp: "Lejátszási lista létrehozva!",
        register: "Regisztráció",
        registerText: "Nincs még fiókod?",
        registrationSuccessful: "A regisztráció sikeres!",
        restore: "Visszaállítás",
        success: "Siker!",
        username: "Felhasználónév",
        usernameDesc: "Ezt később nem tudod megváltoztatni!",
        usernameTaken: "Felhasználónév foglalt!",
        youMayNowLogin: "Most már bejelentkezhetsz!",
        restorePurchase: "Vásárlás visszaállítása",
        backToOrder: "Vissza a vásárláshoz",
        weakPassword: "Ez a jelszó túl gyenge!",
        usernameInvalid: "A felhasználónév csak betűket, és számokat tartalmazhat!",
        weaverContrib: "Grafikai munka (Logó, 404)\nLokalizációs segítség (Magyar)",
        yourCodeIs: "A te kódod:",
        orderResp: "A megrendelés {0} sikeres volt, a te kódod:",
        playlistDeleted: "Lejátszási lista törölve!",
        pageNotFound: "Az oldal nem található!",
        hungaryText: "{0}-el Magyarországról",
        dcs0Contrib: "Szerver üzemeltetés",
        legalSection: "\"Jogi\" részlegét",
        registerCheckbox: "Elmúltam 18 éves és elolvastam a weboldal {0}.",
        sites: "Oldalak",
        englishOnlyTitle: "Lokalizálatlan oldal",
        englishOnlyText: "Ez az oldal csak angol nyelven elérhető, elnézést a kellemetlenségért!",
        legalSectionTitle: "A \"Jogi\" részleg",
        legalSectionText: "Ezeket szükséges elolvasni regisztráció előtt.",
        privacyPolicy: "Adatvédelmi Irányelvek",
        invalidLogin: "Helytelen felhasználónév vagy jelszó",
        accountSettings: "Fiókbeállítások",
        changePass: "Jelszó megváltoztatása"
    },
    de: {
        navSearch: "Suche",
        navPlayer: "Player",
        navLibrary: "Bibliothek",
        createPlaylist: "Erschaffe Wiedergabeliste",
        deletePlaylist: "Lösche Wiedergabeliste",
        deletePlaylistModalText: "Bist du dir sicher? Diese Aktion kann nicht zurückgerufen werden.",
        setLang: "Ändere die Zeigesprache der Anwendung.",
        renamePlaylist: "Ändere Namen der Wiedergabeliste",
        endPlayback: "Ende Wiedergabeliste",
        addToPlaylist: "Zur Playlist hinzufügen",
        confirm: "Bestätigen",
        cancel: "Abbrechen",
        create: "Erschaffen",
        delete: "Löschen",
        rename: "Neu benennen",
        playlist: "Wiedergabeliste",
        play: "Starte",
        pause: "Pause",
        settings: "Einstellungen",
        lang: "Sprache",
        appNameAppend: "Musikspieler",
        description: "Beschreibung",
        related: "Ähnlich",
        linkLastFM: "Verbinde Last.FM",
        unlinkLastFM: "Trenne Last.FM",
        linkLastFMText: "Verbinde deine Last.FM Account mit Ossia und scrolle deine Lieblingslieder.",
        unlinkLastFMText: "Trenne deine Last.FM Account.",
        linkLastFMButton: "Verbinde Account",
        unlinkLastFMBUtton: "Trenne Account",
        openInLastFM: "Öffne in Last.FM",
        friends: "Freunde",
        recentTracks: "Letzte Songs",
        topTracks: "Top Songss",
        nothingHere: "Nix zu finden...",
        selectIcon: "Wähle Ikon",
        wip: "Wird noch entwickelt...",
        about: "Mehr",
        aboutTitle: "Mehr über Ossia",
        aboutText: "Die Ossia Musikplayer ist ein open source projekt, entwickelt von Shie1.\nDas Projekt ist gestartet {0}.",
        plays: "Spielt",
        nowPlaying: "Jetzt Spielt",
        dependencies: "Abhängigkeiten",
        englishOnlyTitle: "Nicht lokalisierte Seite",
        englishOnlyText: "Diese Seite ist nur auf Englisch verfügbar, bitte entschuldigung für die Unannehmlichkeiten."
    }
});

export const NonLocalized = ({ l }: { l: any }) => {
    return (<>{l.getLanguage() !== 'en' &&
        <Paper p="sm" withBorder >
            <Group direction='row'>
                <AlertCircle size={50} />
                <Group direction='column' spacing={4}>
                    <Text size="xl">{localized.englishOnlyTitle}</Text>
                    <Text>{localized.englishOnlyText}</Text>
                </Group>
            </Group>
        </Paper >
    }</>)
}