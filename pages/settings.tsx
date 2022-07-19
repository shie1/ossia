import { Accordion, AccordionItem, Chip, Chips, Container, Text } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Heart, World } from "tabler-icons-react";
import { localized } from "../components/localization";
import { useCookies } from "react-cookie"
import Head from "next/head";
import { showNotification } from "@mantine/notifications";

export const Settings: NextPage = () => {
    const router = useRouter()
    const langClick = useState(0)
    const [cookies, setCookies, removeCookies] = useCookies(["lang"])
    const Languages = () => {
        let i = 0
        const [selected, setSelected] = useState<string>(() => {
            return localized.getLanguage()
        })
        const languageNames = new Intl.DisplayNames([localized.getLanguage()], {
            type: 'language'
        });
        return (<>
            <Chips value={selected}>
                {localized.getAvailableLanguages().map((lang: string) => {
                    const all = Object.keys(localized).filter(item => !item.startsWith("_"))
                    const strings = []
                    for (const item of all) {
                        strings.push(localized.getString(item, lang))
                    }
                    const filled = strings.filter(item => item !== null)
                    const percentage = Math.floor((filled.length * 100) / all.length)
                    i++
                    return <Chip onClick={() => { setCookies("lang", lang); setSelected(lang); router.replace(router.asPath) }} key={i} value={lang}>{languageNames.of(lang)?.substring(0, 1).toUpperCase() + languageNames.of(lang)?.substring(1)!} {percentage}%</Chip>
                })}
            </Chips>
        </>)
    }

    useEffect(() => {
        if (langClick[0] !== 0 && langClick[0] % 5 === 0) {
            showNotification({ id: "hungary", icon: <Heart />, title: localized.formatString(localized.hungaryText!, <>&#128156;</>), message: "" })
        }
    }, [langClick[0]])

    return (<Container>
        <Head>
            <title>Settings | Ossia</title>
        </Head>
        <Accordion>
            <AccordionItem onClick={() => {
                langClick[1](langClick[0] + 1)
            }} label={localized.lang} icon={<World />}>
                <Text my="sm">{localized.setLang}</Text>
                <Languages />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Settings