import { Accordion, AccordionItem, Chip, Chips, Container, Text } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { World } from "tabler-icons-react";
import { localized } from "../components/localization";

export const Settings: NextPage = () => {
    const router = useRouter()
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
                    i++
                    return <Chip onClick={() => { localized.setLanguage(lang); setSelected(lang); router.replace(router.asPath) }} key={i} value={lang}>{languageNames.of(lang)?.substring(0,1).toUpperCase()+languageNames.of(lang)?.substring(1)!}</Chip>
                })}
            </Chips>
        </>)
    }
    return (<Container>
        <Accordion>
            <AccordionItem label={localized.lang} icon={<World />}>
                <Text mb="sm">{localized.setLang}</Text>
                <Languages />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Settings