import { Accordion, AccordionItem, Text, Button } from '@mantine/core'
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next'
import { CalendarTime, ClearAll, Database, DatabaseExport, DatabaseImport, DatabaseOff, X } from 'tabler-icons-react';

const Settings: NextPage = () => {
    const modals = useModals();

    const comingSoon = () => {showNotification({title: 'Feature coming soon...',message: '',icon: <CalendarTime />,
    })}

    const importLocalStorage = comingSoon

    const exportLocalStorage = comingSoon

    const confirm = (callback: any) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Text size="sm">
                    This action is so important that you are required to confirm it with a modal. Please click
                    one of these buttons to proceed.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: callback,
        });
    }

    const clearLocalStorage = () => {
        const action = () => {
            if (typeof window !== 'undefined') {
                localStorage.clear()
                showNotification({
                    title: 'User data cleared',
                    message: '',
                    icon: <X />,
                })
            }
        }
        confirm(action)
    }

    return (
        <>
            <Accordion>
                <AccordionItem icon={<Database />} label="User Data">
                    <Accordion>
                        <AccordionItem icon={<DatabaseOff />} label="Clear User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to clear this data, press the button.</Text>
                            <Button onClick={clearLocalStorage}>Clear data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseImport />} label="Import User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to import this data from another device, press the button.</Text>
                            <Button onClick={importLocalStorage}>Import data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseExport />} label="Export User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to export this data to another device, press the button.</Text>
                            <Button onClick={exportLocalStorage}>Export data</Button>
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default Settings