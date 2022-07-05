import { Container, Title, Text, Group, Accordion, AccordionItem, Paper, Avatar, Table, TypographyStylesProvider, Badge, useMantineTheme } from "@mantine/core";
import type { NextPage } from "next";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { Affiliate, FileCode, Hierarchy, Users } from "tabler-icons-react";
import { interactive } from "../components/styles";
import { useManifest } from "../components/manifest";
import { Prism } from "@mantine/prism"
import { localized } from "../components/localization";
import Link from "next/link";
import { useCustomRouter } from "../components/redirect";
import { useRef } from "react";

const About: NextPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const deps = useSWR("/api/deps", fetcher)
    const manifest = useManifest()
    const theme = useMantineTheme()
    const customRouter = useCustomRouter()
    const depsE = useRef<HTMLDivElement | null>(null)
    let depKey = 0

    const Dep = ({ name, url }: { name: string, url: string }) => {
        return (
            <Paper onClick={() => { customRouter.newTab(url) }} withBorder p="sm" sx={interactive}>
                <Text>{name}</Text>
            </Paper>
        )
    }

    moment.locale(localized.getLanguage())

    return (<Container>
        <Group mb="sm" direction="column" spacing="sm">
            <Title align="center">{localized.aboutTitle}</Title>
            <Group direction="column" spacing={2}>
                <Text>{localized.aboutText.split("\n")[0]}</Text>
                <Text>{localized.aboutText.split("\n")[1].replace('{time}', moment("2022-05-30").fromNow())}</Text>
            </Group>
        </Group>
        <Paper p="sm" withBorder shadow="lg" radius="lg">
            <a rel="noreferrer" target="_blank" href="https://github.com/shie1/ossia">
                <Group sx={interactive} direction="row">
                    <Avatar radius={100} size="xl" src="/ossia_circle.png">Ossia</Avatar>
                    <Group spacing={2} direction="column">
                        <Text size="xl">{manifest?.short_name}</Text>
                        <Text size="sm">{manifest?.name}</Text>
                    </Group>
                </Group>
            </a>
            <Accordion mt="sm">
                <AccordionItem label="manifest.json" icon={<FileCode />}>
                    {manifest && <Prism noCopy language="json">{JSON.stringify(manifest, null, 4)}</Prism>}
                </AccordionItem>
                <AccordionItem label={localized.contributors} icon={<Users />}>
                    <Table>
                        <tr>
                            <Group grow>
                                <Paper onClick={() => { customRouter.newTab("https://www.youtube.com/channel/UC_osfKm8TMv6_kzuhdp_vGg") }} sx={interactive} p="sm" pb={0} withBorder>
                                    <Group mb="sm" direction="row">
                                        <Avatar src="https://yt3.ggpht.com/ytc/AKedOLQUwERYNidMP7NkgHmpxeT6JE2JXhOUfWEkihvM=s88-c-k-c0x00ffffff-no-rj" radius="xl" size="lg">Wl</Avatar>
                                        <Text size="lg">Wladynosz</Text>
                                    </Group>
                                    <TypographyStylesProvider>
                                        <ul>
                                            <li>{localized.germanContrib}</li>
                                        </ul>
                                    </TypographyStylesProvider>
                                </Paper>
                            </Group>
                        </tr>
                    </Table>
                </AccordionItem>
                <AccordionItem label={<Group spacing={6}><Text>{localized.dependencies}</Text> <Badge gradient={{ to: theme.colors[theme.primaryColor][theme.primaryShade as any], from: "indigo" }} variant="gradient">{depsE.current?.children.length}</Badge></Group>} icon={<Affiliate />}>
                    <Group ref={depsE} spacing="sm" direction="row">
                        <Dep name="Next.JS" url="https://nextjs.org/" />
                        <Dep name="Vercel" url="https://vercel.com" />
                        <Dep name="React" url="https://reactjs.org" />
                        <Dep name="Typescript" url="https://www.typescriptlang.org/" />
                        <Dep name="Mantine" url="https://mantine.dev" />
                        <Dep name="Piped" url="https://piped.kavin.rocks" />
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

export default About