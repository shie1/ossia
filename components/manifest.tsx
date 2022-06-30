import useSWR from "swr";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useManifest = () => {
    const { data, error } = useSWR(
        "/api/manifest.webmanifest",
        fetcher
    );
    if (error) { return error } else { return data }
}