import { useEffect, useState } from "react";
import gamejamData from "../data/json/gamejam.json"
import GameJamItemForm from "./gamejam/GameJamItemForm";
import { isNsfw } from "./utils";
import type { SketchFormProps } from "./computer/SketchForm";
import SketchForm from "./computer/SketchForm";
import { useSearchParams } from "react-router";
import type { ButtonInfo } from "./computer/impl/game/GameForm";
import GamejamIntroComponent from "./components/intro/GamejamIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";

interface GameJamInfo
{
    jams: GameJamItem[]
}

export interface GameJamItem
{
    name: string,
    fullName: string,
    duration: number,
    engine: string,
    version: string,
    format?: string,
    nsfw: boolean,
    theme: string[],
    website: string | null,
    sketch: GamejamSketch | null,
    rating: GamejamRating | null,
    controls: string[],
    date: string,
    location: string,
    github: string | null,
    event: string,
    imagePosOverrides?: string,
    gifPosOverrides?: string,
    postModification: string | null
}

export interface GamejamSketch
{
    folder: string,
    filename: string | null
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

export function getOverallScore(item: GameJamItem): number | null {
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
    const [buttons, setButtons] = useState<ButtonInfo[]>([]);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [shownSketch, setShownSketch] = useState<GameJamItem | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const game = searchParams.get("game")?.toUpperCase();

        if (game) {
            let target = jamData.jams.find(x => x.name.toUpperCase() === game);
            if (target && target.sketch) {
                setShownSketch(target);
            } else {
                setShownSketch(null);
            }
        } else {
            setShownSketch(null);
        }
    }, [searchParams]);

    useEffect(() => {
        if (shownSketch) {
            setComputerProps({
                isOn: true,
                loadedGame: {
                    defaultResFolder: shownSketch.sketch!.folder,
                    defaultFilename: `Build/${shownSketch.sketch!.filename}`,
                    defaultEngine: shownSketch.engine,
                    defaultUnityVersion: shownSketch.version
                },
                buttons: [],
                isFullscreen: false,
                toggleDesktopModule: () => { return false; }
            });
        } else {
            setComputerProps(null);
        }
    }, [ shownSketch ]);

    useEffect(() => {
        if (shownSketch) {
            setButtons([{
                name: "power_settings_new",
                type: "Custom",
                scene: () => {
                    setComputerProps(null);
                    searchParams.delete("game");
                },
                iconType: "icon",
                disabled: false,
                gameViewOnly: true
            }, {
                name: "help",
                type: "GiveInfo" as const,
                scene: `Controls:\n${shownSketch.controls.join("\n")}` + (shownSketch.postModification ? `\n\nPost jam update:\n${shownSketch.postModification}` : ""),
                iconType: "icon",
                disabled: false,
                gameViewOnly: true
            }, {
                name: isFullscreen ? "fullscreen_exit" : "fullscreen",
                type: "Custom",
                scene: () => {
                    setIsFullscreen(x => !x);
                },
                iconType: "icon",
                disabled: false,
                gameViewOnly: true
            }]);
        }
    }, [ shownSketch, isFullscreen ])

    return <>
        <QuoteComponent />
        <GamejamIntroComponent />
        <NavigationComponent />
        {
            computerProps !== null ?
            <SketchForm
                isOn={computerProps.isOn}
                loadedGame={computerProps.loadedGame}
                buttons={buttons}
                isFullscreen={isFullscreen}
                toggleDesktopModule={computerProps.toggleDesktopModule}
            />
            : <></>
        }
        <div className="container box">
            <p className="mark">Gamejam</p>
            <div className="container">
                <label htmlFor="sort-mode">Sort mode</label>
                <select id="sort-mode" value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}>
                    <option value="Date">Date</option>
                    <option value="Score">Score</option>
                </select>
            </div>
            <div className="fullscreen is-flex flex-center-hor">
                {
                    getSortedGamejams(
                        jamData.jams, sortMode
                    )
                        .map(x => <GameJamItemForm key={x.fullName} item={x} showComputer={() => {
                            setSearchParams(sp => {
                                sp.set("game", x.name);
                                return sp;
                            });
                        }} />)
                }
            </div>
        </div>
    </> 
}