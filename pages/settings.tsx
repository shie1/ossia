import { Accordion, AccordionItem, Chip, Chips, Container, Text, Button } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BrandLastfm, Link, World } from "tabler-icons-react";
import { useLastFM } from "../components/lastfm";
import { localized } from "../components/localization";
import {useCookies} from "react-cookie"

export const Settings: NextPage = () => {
    const router = useRouter()
    const lastfm = useLastFM()
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
                    i++
                    return <Chip onClick={() => { setCookies("lang",lang); setSelected(lang); router.replace(router.asPath) }} key={i} value={lang}>{languageNames.of(lang)?.substring(0, 1).toUpperCase() + languageNames.of(lang)?.substring(1)!}</Chip>
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
            <AccordionItem label={!lastfm.cookie ? localized.linkLastFM : localized.unlinkLastFM} icon={<BrandLastfm />}>
                <Text mb="sm">{!lastfm.cookie ? localized.linkLastFMText : localized.unlinkLastFMText}</Text>
                <Button onClick={()=>{router.push(!lastfm.cookie ? "/login" : "/logout")}} variant="light" leftIcon={<Link />}>{!lastfm.cookie ? localized.linkLastFMButton : localized.unlinkLastFMBUtton}</Button>
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default Settings