import { Container, Title, Text, Group, Accordion, AccordionItem, Paper, Avatar } from "@mantine/core";
import type { NextPage } from "next";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { FileCode, Hierarchy } from "tabler-icons-react";
import { interactive } from "../components/styles";
import { useManifest } from "../components/manifest";
import { Prism } from "@mantine/prism"
import { localized } from "../components/localization";

const About: NextPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const deps = useSWR("/api/deps", fetcher)
    const manifest = useManifest()

    const Dep = ({ name, url }: { name: string, url: string }) => {
        return (<a rel="noreferrer" target="_blank" href={url}>
            <Paper withBorder p="sm" sx={interactive}>
                <Text>{name}</Text>
            </Paper>
        </a>)
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
            <Group direction="row">
                <Avatar size="xl" src="/ossia_circle.png">Ossia</Avatar>
                <Group spacing={2} direction="column">
                    <Text size="xl">{manifest?.short_name}</Text>
                    <Text size="sm">{manifest?.name}</Text>
                </Group>
            </Group>
            <Accordion mt="sm">
                <AccordionItem label="manifest.json" icon={<FileCode />}>
                    {manifest && <Prism noCopy language="json">{JSON.stringify(manifest, null, 4)}</Prism>}
                </AccordionItem>
                <AccordionItem label={localized.dependencies} icon={<Hierarchy />}>
                    <Group spacing="sm" direction="row">
                        <Dep name="Next.JS" url="https://nextjs.org/" />
                        <Dep name="React" url="https://reactjs.org" />
                        <Dep name="Typescript" url="https://www.typescriptlang.org/" />
                        <Dep name="Mantine" url="https://mantine.dev" />
                        <Dep name="Piped" url="https://piped.kavin.rocks" />
                        {deps.data && Object.keys(deps.data).map((dep: string) => {
                            const url = "https://www.npmjs.com/package/" + dep
                            if (["@types/", "@mantine/"].find(item => dep.startsWith(item))) { return <></> }
                            if (["react", "next", "react-dom"].find(item => item === dep)) { return <></> }
                            return (<Dep name={dep} url={url} />)
                        })}
                    </Group>
                </AccordionItem>
            </Accordion>
        </Paper>
    </Container>)
}

export default About