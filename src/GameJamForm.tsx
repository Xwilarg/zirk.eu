import { useEffect, useState } from "react";
import gamejamData from "../data/json/gamejam.json"
import GameJamItemForm from "./item/GameJamItemForm";
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
    postModification: string | null,
    team: string[]
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

type SortMode = "Date" | "Score" | "Duration";
type TeamSize = "Solo" | "Group";
type JamDuration = "1H" | "1D" | "3D" | "9D" | "1M" | "More";
type JamSFW = "SFW" | "NSFW"

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

export function getSortedGamejams(items: GameJamItem[], sortMode: SortMode, teamSize: TeamSize[] | null, jamDuration: JamDuration[] | null, jamSFW: JamSFW[] | null): GameJamItem[]
{
    if (!jamSFW) {
        const nsfwStatus = isNsfw();
        if (nsfwStatus === "FullSFW") jamSFW = [ "SFW" ];
        else jamSFW = [ "SFW", "NSFW" ];
    }
    return items
    .filter(x => (!x.nsfw && jamSFW.includes("SFW")) || (x.nsfw && jamSFW.includes("NSFW")))
    .filter(x => !teamSize || (x.team.length === 1 && teamSize.includes("Solo")) || (x.team.length > 1 && teamSize.includes("Group")))
    .filter(x => !jamDuration ||
        (x.duration <= 1 && jamDuration.includes("1H")) ||
        (x.duration > 1 && x.duration <= 24 && jamDuration.includes("1D")) ||
        (x.duration > 24 && x.duration <= 74 && jamDuration.includes("3D")) ||
        (x.duration > 74 && x.duration <= 240 && jamDuration.includes("9D")) ||
        (x.duration > 240 && x.duration <= 768 && jamDuration.includes("1M")) ||
        (x.duration > 768 && jamDuration.includes("More"))
    )
    .sort((a, b) => {
        if (sortMode === "Score")
        {
            const sa = getOverallScore(a);
            const sb = getOverallScore(b)

            if (sa === null) return 1;
            if (sb === null) return -1;

            return sa - sb;
        }
        else if (sortMode === "Duration")
        {
            return b.duration - a.duration;
        }
        return 0;
    });
}

function toggleArrayElement(array: any[], element: any) {
    if (array.includes(element)) {
        return array.filter(x => x !== element);
    }
    return [...array, element];
}

export default function GameJamForm() {
    let nsfwStatus = isNsfw();

    const [jamData, setJamData] = useState<GameJamInfo>(gamejamData);
    const [computerProps, setComputerProps] = useState<SketchFormProps | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>("Date");
    const [teamSize, setTeamSize] = useState<TeamSize[]>(["Solo", "Group"]);
    const [duration, setDuration] = useState<JamDuration[]>(["1D", "3D", "9D", "1M", "More"]);
    const [sfw, setSFW] = useState<JamSFW[]>(() => nsfwStatus === "FullSFW" ? [ "SFW" ] : [ "SFW", "NSFW" ]);
    const [buttons, setButtons] = useState<ButtonInfo[]>([]);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [shownSketch, setShownSketch] = useState<GameJamItem | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const game = searchParams.get("game")?.toUpperCase();

        if (game) {
            let target = jamData.jams.find(x => x.name?.toUpperCase() === game);
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
                    defaultFilename: shownSketch.sketch!.filename!,
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
            let buttons: Array<ButtonInfo> = []

            if (searchParams.get("embed") !== "1") {
                    buttons.push({
                    name: "power_settings_new",
                    type: "Custom",
                    scene: () => {
                        setComputerProps(null);
                        searchParams.delete("game");
                    },
                    iconType: "icon",
                    disabled: false,
                    gameViewOnly: true
                });
            }

            buttons = buttons.concat([{
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
            }, {
                name: "share",
                type: "Custom",
                scene: () => {
                    const shareUrl = new URL(window.location.href);
                    shareUrl.searchParams.set("embed", "1");
                    if (navigator.share)
                    {
                        navigator.share({url: shareUrl.href});
                    }
                    else
                    {
                        window.prompt("Copy to share", shareUrl.href)
                    }
                },
                iconType: "icon",
                disabled: false,
                gameViewOnly: true
            }]);
            setButtons(buttons);
        }
    }, [ shownSketch, isFullscreen ])

    if (searchParams.get("embed") === "1") {
        return computerProps !== null ?
            <SketchForm
                isOn={computerProps.isOn}
                loadedGame={computerProps.loadedGame}
                buttons={buttons}
                isFullscreen={isFullscreen}
                toggleDesktopModule={computerProps.toggleDesktopModule}
            />
            : <></>
    }

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
                <span id="sort-mode" className="button-group">
                    <button title="Date" className="button-icon" disabled={sortMode === "Date"} onClick={_ => setSortMode("Date")}><span className="material-symbols-outlined">calendar_today</span></button>
                    <button title="Score" className="button-icon" disabled={sortMode === "Score"} onClick={_ => setSortMode("Score")}><span className="material-symbols-outlined">leaderboard</span></button>
                    <button title="Duration" className="button-icon" disabled={sortMode === "Duration"} onClick={_ => setSortMode("Duration")}><span className="material-symbols-outlined">timer</span></button>
                </span>
                <label htmlFor="team-size">Team size</label>
                <span id="team-size" className="button-group">
                    <button title="Solo" className={"button-icon " + (teamSize.includes("Solo") ? "active" : "")} onClick={_ => setTeamSize(toggleArrayElement(teamSize, "Solo"))}><span className="material-symbols-outlined">person</span></button>
                    <button title="Group" className={"button-icon " + (teamSize.includes("Group") ? "active" : "")} onClick={_ => setTeamSize(toggleArrayElement(teamSize, "Group"))}><span className="material-symbols-outlined">groups</span></button>
                </span>
                <label htmlFor="team-size">Duration</label>
                <span id="team-size" className="button-group">
                    <button title="≤1 day" className={"button-icon " + (duration.includes("1D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "1D"))}>1D</button>
                    <button title="≤3 days" className={"button-icon " + (duration.includes("3D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "3D"))}>3D</button>
                    <button title="≤9 days" className={"button-icon " + (duration.includes("9D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "9D"))}>9D</button>
                    <button title="≤1 month" className={"button-icon " + (duration.includes("1M") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "1M"))}>1M</button>
                    <button title=">1 month" className={"button-icon " + (duration.includes("More") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "More"))}>More</button>
                </span>
                {
                    nsfwStatus === "FullSFW" ?
                    <></> :
                    <>
                        <label htmlFor="team-size">Content warnings</label>
                        <span id="team-size" className="button-group">
                            <button title="All-age" className={"button-icon " + (sfw.includes("SFW") ? "active" : "")} onClick={_ => setSFW(toggleArrayElement(sfw, "SFW"))}><span className="material-symbols-outlined">no_adult_content</span></button>
                            <button title="Adult content" className={"button-icon " + (sfw.includes("NSFW") ? "active" : "")} onClick={_ => setSFW(toggleArrayElement(sfw, "NSFW"))}><span className="material-symbols-outlined">18_up_rating</span></button>
                        </span>
                    </>
                }
            </div>
            <div className="is-flex flex-center-hor">
                {
                    getSortedGamejams(
                        jamData.jams, sortMode, teamSize, duration, sfw
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