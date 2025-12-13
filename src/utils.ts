import { useSearchParams } from "react-router";

export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function isNsfw(): NsfwStatus {
    const [searchParams, setSearchParams] = useSearchParams();

    const s = searchParams.get("s");
    if (s === "0") return "NSFW"
    if (s === "2") return "FullSFW"
    return "SFW"
}

export function getNavigation(url: string) {
    const [searchParams, setSearchParams] = useSearchParams();

    searchParams.delete("game");

    return `${url}?${searchParams}`;
}

export type NsfwStatus = "NSFW" | "SFW" | "FullSFW";