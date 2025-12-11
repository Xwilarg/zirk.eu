import { useState } from "react";
import gamejamData from "../data/json/gamejam.json"
import GameJamItemForm from "./gamejam/GameJamItemForm";
import { isNsfw } from "./utils";
import NavigationForm from "./NavigationForm";
import type { SketchFormProps } from "./computer/SketchForm";
import SketchForm from "./computer/SketchForm";

interface GameJamInfo
{
    jams: GameJamItem[]
}

export interface GameJamItem
{
    name: string,
    fullName: string,
    version: string,
    format?: string,
    nsfw: boolean,
    theme: string[],
    website: string | null,
    sketch: GamejamSketch | null,
    rating: GamejamRating | null
}

export interface GamejamSketch
{
    folder: string,
    filename: string
}

export interface GamejamRating
{
    entries: number | null,
    entriesRated: number | null,
    scores?: { [id: string]: GamejamScore | undefined } | null;
}

export interface GamejamScore
{
    rank: number | null
}

type SortMode = "Date" | "Score";

function getOverallScore(item: GameJamItem): number | null {
    if (!item.rating || !item.rating.scores) return null;

    const entries = item.rating.entriesRated ?? item.rating.entries;
    if (!entries) return null;
    if ("Overall" in item.rating.scores)
    {
        const o = item.rating.scores["Overall"];
        if (!o || !o.rank) return null;
        return item.rating.scores["Overall"]!.rank! / entries;
    }
    return null;
}

export function getSortedGamejams(items: GameJamItem[], sortMode: SortMode): GameJamItem[]
{
    let nsfwStatus = isNsfw();
    return items.filter(x => nsfwStatus !== "FullSFW" || !x.nsfw).sort((a, b) => {
        if (sortMode === "Score")
        {
            const sa = getOverallScore(a);
            const sb = getOverallScore(b)

            if (sa === null) return 1;
            if (sb === null) return -1;

            return sa - sb;
        }
        return 0;
    });
}

export default function GameJamForm() {
    const [jamData, setJamData] = useState<GameJamInfo>(gamejamData);
    const [computerProps, setComputerProps] = useState<SketchFormProps | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>("Date");

    return <>
        <NavigationForm />
        {
            computerProps !== null ?
            <SketchForm
                isOn={computerProps.isOn}
                defaultResFolder={computerProps.defaultResFolder}
                defaultFilename={computerProps.defaultFilename}
                defaultUnityVersion={computerProps.defaultUnityVersion}
                buttons={computerProps.buttons}
            />
            : <></>
        }
        <div className="container box">
            <label htmlFor="sort-mode">Sort mode</label>
            <select id="sort-mode" value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}>
                <option value="Date">Date</option>
                <option value="Score">Score</option>
            </select>
        </div>
        <div className="fullscreen is-flex">
            {
                getSortedGamejams(
                    jamData.jams, sortMode
                )
                    .map(x => <GameJamItemForm key={x.fullName} item={x} showComputer={(defaultResFolder: string, defaultFilename: string, defaultUnityVersion: string) => {
                        setComputerProps({
                            isOn: true,
                            defaultResFolder: defaultResFolder,
                            defaultFilename: defaultFilename,
                            defaultUnityVersion: defaultUnityVersion,
                            buttons: []
                        })
                    }} />)
            }
        </div>
    </> 
}