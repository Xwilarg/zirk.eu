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
    sketch: GamejamSketch | null
}

export interface GamejamSketch
{
    folder: string,
    filename: string
}

export default function GameJamForm() {
    const [jamData, setJamData] = useState<GameJamInfo>(gamejamData);
    const [computerProps, setComputerProps] = useState<SketchFormProps | null>(null);

    let nsfwStatus = isNsfw();
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
        <div className="fullscreen is-flex">
            {
                jamData.jams
                    .filter(x => nsfwStatus !== "FullSFW" || !x.nsfw)
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