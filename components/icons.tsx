import { Center, Grid, Group, Modal, Pagination, Paper, TextInput, Text, Popover } from "@mantine/core"
import { createElement, useEffect, useState } from "react"
import * as Icons from "tabler-icons-react"
import { localized } from "./localization"
import { interactive } from "./styles"

const Icon = ({ icon, size, color }: { icon: string, size?: number, color?: string }) => {
    return createElement((Icons as any)[icon], { size: size, color: color })
}

export const useIconSelector = (defaultIcon?: Icons.Icon) => {
    const [opened, setOpened] = useState(false)
    const [icon, setIcon] = useState<any>(defaultIcon || <Icon icon={Object.keys(Icons)[Math.floor(Math.random() * Object.keys(Icons).length)]} />)
    const [page, setPage] = useState<number>(1)
    const [filteredIcons, setFilteredIcons] = useState(Object.keys(Icons))
    const [filter, setFilter] = useState("")
    const itemsPerPage = 24
    useEffect(() => {
        setPage(1)
        setFilteredIcons(Object.keys(Icons).filter((item: string) => item.toLowerCase().search(filter.toLowerCase()) !== -1))
    }, [filter])
    const IconsDisp = () => {
        let i = 0
        const [pOpen, setPOpen] = useState(false)
        return (<>
            {filteredIcons.map((icon: string) => {
                i++
                if (page * itemsPerPage >= i && (page - 1) * itemsPerPage < i) {
                    return (<>
                        <Grid.Col xs={2} span={4}>
                            <Paper className="oneliner" onClick={() => { setIcon(<Icon icon={icon} />); setOpened(false) }} p="sm" withBorder sx={interactive}>
                                <Center>
                                    <Icon size={40} icon={icon} />
                                </Center>
                                <Text size="xs" align="center">{icon}</Text>
                            </Paper>
                        </Grid.Col>
                    </>)
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
        </>
    })
}