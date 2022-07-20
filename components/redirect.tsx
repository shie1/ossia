import { useModals } from "@mantine/modals"
import { Text } from "@mantine/core";
import { localized } from "./localization";

export const useCustomRouter = () => {
    const modals = useModals()
    function newTab(href: URL | string) {
        if (typeof href === 'string') { href = new URL(href) }
        modals.openConfirmModal({
            title: localized.newTabTitle,
            size: "lg",
            children: (
                <Text sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: localized.formatString(localized.newTabText!, `<b>${href.host.replace('www.', '')}</b>`.replace('\n', '<br>')) as string }} />
            ),
            labels: { confirm: localized.confirm, cancel: localized.cancel },
            onConfirm: () => { window.open(href) },
        });
    }
    return { newTab: newTab }
}