export const useLoading = () => {
    function start() {
        if (typeof window === 'undefined') return
        document.documentElement.setAttribute('data-loading', "true")
    }
    function stop() {
        if (typeof window === 'undefined') return
        document.documentElement.setAttribute('data-loading', "false")
    }
    return {'start': start, 'stop': stop}
}