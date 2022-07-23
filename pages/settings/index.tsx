import { Accordion, AccordionItem, Button, Chip, Chips, Container, Group, Paper, Text } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Download, Heart, Lock, User, World } from "tabler-icons-react";
import { localized } from "../../components/localization";
import { useCookies } from "react-cookie"
import Head from "next/head";
import { showNotification } from "@mantine/notifications";
import { interactive } from "../../components/styles";
import Link from "next/link";

export const Settings: NextPage = (props: any) => {
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
        <Accordion >
            <AccordionItem label={localized.lang} icon={<World />}>
                <Text onClick={() => {
                    langClick[1](langClick[0] + 1)
                }} my="sm">{localized.setLang}</Text>
                <Languages />
            </AccordionItem>
            {!props.installed && <AccordionItem label={localized.install} icon={<Download />} onClick={(e) => { e.preventDefault() }}>
                <Text my="sm">{localized.installText}</Text>
                <Button onClick={() => { props.install.prompt() }} variant="light" leftIcon={<Download />}>{localized.install}</Button>
            </AccordionItem>}
            {props.me && <AccordionItem label={localized.accountSettings} icon={<User />}>
                <Group grow direction="column" spacing="sm">
                    <Link href="/settings/changepass">
                        <Paper sx={interactive} p="sm" withBorder>
                            <Group direction="row">
                                <Lock size={30} />
                                <Text size="lg">{localized.changePass}</Text>
                            </Group>
                        </Paper>
                    </Link>
                </Group>
            </AccordionItem>}
        </Accordion>
    </Container>)
}

export default Settings