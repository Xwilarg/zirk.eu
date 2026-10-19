import { useSearchParams } from "react-router";

export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randArrayElement(arr: any[]) {
    return arr[randInt(arr.length)];
}

export function isNsfw(): NsfwStatus {
    const [searchParams] = useSearchParams();

    const s = searchParams.get("s");
    if (s === "0") return "NSFW"
    if (s === "2") return "FullSFW"
    return "SFW"
}

export function getNavigationNoHook(url: string, searchParams: URLSearchParams, hash: string = "", deleteGameParam: boolean = true): string {
    if (deleteGameParam) searchParams.delete("share");

    return `${url}?${searchParams}${hash}`;
}

export function toTitleCase(str: string): string
{
    return str.split("_")
        .filter(x => x !== "")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

export type NsfwStatus = "NSFW" | "SFW" | "FullSFW";