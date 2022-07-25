import {
    Container,
    Title,
    Text,
    Group,
    Accordion,
    AccordionItem,
    Paper,
    Avatar,
    Table,
    TypographyStylesProvider,
    useMantineTheme,
} from "@mantine/core";
import type { NextPage } from "next";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { Affiliate, BrandDocker, FileCode, Users } from "tabler-icons-react";
import { interactive } from "../components/styles";
import { Prism } from "@mantine/prism"
import { localized } from "../components/localization";
import { useCustomRouter } from "../components/redirect";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { fetcher } from "../components/manifest";
import { apiCall } from "../components/api";
import { useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

const About: NextPage = (props: any) => {
    const deps = useSWR("/api/deps", fetcher)
    const manifest = props.manifest
    const theme = useMantineTheme()
    const customRouter = useCustomRouter()
    const depsE = useRef<HTMLDivElement | null>(null)
    const [buildDate, setBuildDate] = useState<null | Date>(null)
    let depKey = 0

    const Dep = ({ name, url }: { name: string, url: string }) => {
        return (
            <Paper onClick={() => { customRouter.newTab(url) }} withBorder p="sm" sx={interactive}>
                <Text>{name}</Text>
            </Paper>
        )
    }

    useEffect(() => {
        apiCall("GET", "/api/build", {}).then(resp => {
            setBuildDate(resp !== 0 ? new Date(resp) : null)
        })
    }, [])

    useHotkeys([["b", () => {
        showNotification({ 'title': "Build timestamp", 'message': buildDate ? buildDate?.toLocaleString() : "Not found!", icon: <BrandDocker /> })
    }],])

    moment.locale(localized.getLanguage())

    return (<Container>
        <Head>
            <title>About | Ossia</title>
        </Head>
        <Group mb="sm" direction="column" spacing="sm">
            <Title align="center">{localized.aboutTitle}</Title>
            <Group direction="column" spacing={2}>
                <Text>{localized.aboutText.split("\n")[0]}</Text>
                <Text>{localized.formatString(localized.aboutText.split("\n")![1], moment("2022-05-30").fromNow())}</Text>
            </Group>
        </Group>
        <Paper p="sm" withBorder shadow="lg" radius="lg">
            <Group onClick={() => { customRouter.newTab("https://github.com/shie1/ossia") }} sx={interactive} direction="row">
                <Avatar radius={100} size="xl" src="api/img/ossia_circle.png">Ossia</Avatar>
                <Group spacing={2} direction="column">
                    <Text size="xl">{manifest?.short_name}</Text>
                    <Text size="sm">{manifest?.name}</Text>
                </Group>
            </Group>
            <Accordion mt="sm">
                <AccordionItem label="manifest.json" icon={<FileCode />}>
                    {manifest && <Prism noCopy language="json">{JSON.stringify(manifest, null, 4)}</Prism>}
                </AccordionItem>
                <AccordionItem label={localized.contributors} icon={<Users />}>
                    <Table>
                        <tr>
                            <Group grow>
                                <Contributor href="https://dcs0.hu" avatar="https://avatars.githubusercontent.com/u/57868425" name="dcs0" customRouter={customRouter}>
                                    <ul>
                                        <li>{localized.dcs0Contrib.split("\n")[0]}</li>
                                        <li>{localized.dcs0Contrib.split("\n")[1]}</li>
                                    </ul>
                                </Contributor>
                                <Contributor href="https://www.youtube.com/c/Weaver2822" avatar="https://media.discordapp.net/attachments/831841076062060634/998300647965343786/milan_-_lampalaz.png" name="Weaver" customRouter={customRouter}>
                                    <ul>
                                        <li>{localized.weaverContrib?.split("\n")[0]}</li>
                                        <li>{localized.weaverContrib?.split("\n")[1]}</li>
                                    </ul>
                                </Contributor>
                                <Contributor href="https://www.youtube.com/channel/UC_osfKm8TMv6_kzuhdp_vGg" avatar="https://yt3.ggpht.com/ytc/AKedOLQUwERYNidMP7NkgHmpxeT6JE2JXhOUfWEkihvM=s88-c-k-c0x00ffffff-no-rj" name="Wladynosz" customRouter={customRouter}>
                                    <ul>
                                        <li>{localized.germanContrib}</li>
                                    </ul>
                                </Contributor>
                            </Group>
                        </tr>
                    </Table>
                </AccordionItem>
                <AccordionItem label={<Group spacing={6}><Text>{localized.dependencies}</Text></Group>} icon={<Affiliate />}>
                    <Group spacing="sm" direction="row">
                        <Group spacing="sm" direction="row" ref={depsE}>
                            <Dep name="Next.JS" url="https://nextjs.org/" />
                            <Dep name="React" url="https://reactjs.org" />
                            <Dep name="Typescript" url="https://www.typescriptlang.org/" />
                            <Dep name="Mantine" url="https://mantine.dev" />
                            <Dep name="Piped" url="https://piped.kavin.rocks" />
                            <Dep name="MySQL" url="https://www.mysql.com/" />
                            <Dep name="Last.FM" url="https://last.fm" />
                        </Group>
                        {deps.data && Object.keys(deps.data).map((dep: string) => {
                            depKey++
                            const url = "https://www.npmjs.com/package/" + dep
                            if (["@types/", "@mantine/"].find(item => dep.startsWith(item))) { return <></> }
                            if (["react", "next", "react-dom"].find(item => item === dep)) { return <></> }
                            return (<Dep key={depKey} name={dep} url={url} />)
                        })}
                    </Group>
                </AccordionItem>
            </Accordion>
        </Paper>
    </Container>)
}


function Contributor({ customRouter, name, avatar, children, href }: { customRouter: any, name: string, avatar?: string, children: any, href?: string }) {
    return (<Paper style={{ width: '100%' }} onClick={() => {
        if (href) customRouter.newTab(href);
    }} sx={interactive} p="sm" pb={0} withBorder>
        <Group mb="sm" direction="row">
            <Avatar imageProps={{ draggable: false }} src={avatar} radius="xl" size="lg">{name.substring(0, 1).toUpperCase()}{name.substring(1, 2)}</Avatar>
            <Text size="lg">{name}</Text>
        </Group>
        <TypographyStylesProvider>
            {children}
        </TypographyStylesProvider>
    </Paper>);
}
export default About