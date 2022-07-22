import { Center, Grid, Group, Modal, Pagination, Paper, TextInput, Text, Popover } from "@mantine/core"
import { createElement, useEffect, useState } from "react"
import * as Icons from "tabler-icons-react"
import { localized } from "./localization"
import { interactive } from "./styles"
const stringComparison = require("string-comparison")

export const Icon = ({ icon, size, color }: { icon: string, size?: number, color?: string }) => {
    return createElement((Icons as any)[icon], { size: size, color: color })
}

export const useIconSelector = (defaultIcon?: string) => {
    const comp = stringComparison.levenshtein
    const [opened, setOpened] = useState(false)
    const [icon, setIcon] = useState<any>(defaultIcon || Object.keys(Icons)[Math.floor(Math.random() * Object.keys(Icons).length)])
    const [page, setPage] = useState<number>(1)
    const [filteredIcons, setFilteredIcons] = useState(Object.keys(Icons))
    const [filter, setFilter] = useState("")
    const itemsPerPage = 24
    useEffect(() => {
        setPage(1)
        setFilteredIcons(Array.from(new Set([...Object.keys(Icons).filter((item: string) => item.toLowerCase().search(filter.toLowerCase()) !== -1), ...Object.keys(Icons).filter((item: string) => comp.similarity(item, filter) >= .9)])))
    }, [filter])
    const IconsDisp = () => {
        return (<>
            {filteredIcons.map((icon: string, i: number) => {
                if (page * itemsPerPage >= i && (page - 1) * itemsPerPage < i) {
                    return (<Grid.Col key={i} xs={2} span={4}>
                        <Paper className="oneliner" onClick={() => { setIcon(icon); setOpened(false) }} p="sm" withBorder sx={interactive}>
                            <Center>
                                <Icon size={40} icon={icon} />
                            </Center>
                            <Text size="xs" align="center">{icon}</Text>
                        </Paper>
                    </Grid.Col>)
                }
            })}
        </>)
    }
    return ({
        'open': () => { setOpened(true) }, 'close': () => { setOpened(false) }, 'icon': icon, 'modal': <>
            <Modal
                title={localized.selectIcon}
                opened={opened}
                onClose={() => { setOpened(false) }}
                withCloseButton
                size="lg"
            >
                <TextInput mb="md" value={filter} onChange={(e) => { setFilter(e.currentTarget.value) }} />
                <Grid>
                    <IconsDisp />
                </Grid>
                <Pagination onChange={setPage} mt="md" align="center" position="center" page={page} total={Math.round(filteredIcons.length / itemsPerPage)} />
            </Modal>
        </>, setIcon: setIcon
    })
}