import { Container, Group, Paper, Text, Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import { Lock } from "tabler-icons-react";
import { localized } from "../../components/localization";
import { interactive } from "../../components/styles";

const Page = ({ icon, label, href }: { icon: ReactNode, label: ReactNode, href: string }) => {
    return (<Link href={href}>
        <Paper sx={interactive} p="sm" withBorder>
            <Group direction="row">
                {icon}
                <Text size="xl">{label}</Text>
            </Group>
        </Paper>
    </Link>)
}

const Legal: NextPage = () => {
    return (<Container>
        <Head>
            <title>Legal | Ossia</title>
        </Head>
        <Group direction="column" mb="sm" spacing={4}>
            <Title>{localized.legalSectionTitle}</Title>
            <Text>{localized.legalSectionText}</Text>
        </Group>
        <Group grow direction="column">
            <Page icon={<Lock size={30} />} label={localized.privacyPolicy} href="/legal/privacy" />
        </Group>
    </Container>)
}

export default Legal