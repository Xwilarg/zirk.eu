import { useState } from "react";
import gamejamData from "../data/json/gamejam.json"
import GameJamItemForm from "./gamejam/GameJamItemForm";
import { isNsfw } from "./utils";
import NavigationForm from "./NavigationForm";

interface GameJamInfo
{
    jams: GameJamItem[]
}

export interface GameJamItem
{
    name: string,
    fullName: string,
    format?: string,
    nsfw: boolean,
    theme: string[],
    website: string | null,
    sketch: GamejamSketch | null
}

export interface GamejamSketch
{
    folder: string,
    filename: string
}

export default function GameJamForm() {
    const [jamData, setJamData] = useState<GameJamInfo>(gamejamData);

    let nsfwStatus = isNsfw();
    return <>
        <NavigationForm />
        <div className="fullscreen is-flex">
            {
                jamData.jams
                    .filter(x => nsfwStatus !== "FullSFW" || !x.nsfw)
                    .map(x => <GameJamItemForm key={x.fullName} item={x} />)
            }
        </div>
    </> 
}