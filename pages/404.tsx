import { AspectRatio, Center, Container, Group, Image, Text, Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { localized } from "../components/localization";

const Page404: NextPage = () => {
    return (<Container sx={{ height: '100%' }}>
        <Head>
            <title>404: {localized.pageNotFound}</title>
        </Head>
        <Group position="center" align="center" sx={{ height: '95%' }} direction="row">
            <Center mx={30}>
                <Image alt="Sad robot on tower" sx={{ maxWidth: '38vh' }} src="https://place-hold.it/720x1080&fontsize=50" />
            </Center>
            <Group mx={30} direction="column" spacing={4}>
                <Title sx={{ fontSize: '3rem' }}>404</Title>
                <Text size="xl">{localized.pageNotFound}</Text>
            </Group>
        </Group>
    </Container>)
}

export default Page404