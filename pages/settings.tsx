import { Accordion, AccordionItem, Chip, Chips, Container, Text } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { World } from "tabler-icons-react";
import { localized } from "../components/localization";
import { useCookies } from "react-cookie"
import Head from "next/head";

export const Settings: NextPage = () => {
    const router = useRouter()
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
    return (<Container>
        <Head>
            <title>{localized.settings} | Ossia</title>
        </Head>
        <Accordion>
            <AccordionItem label={localized.lang} icon={<World />}>
                <Text my="sm">{localized.setLang}</Text>
                <Languages />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Settings