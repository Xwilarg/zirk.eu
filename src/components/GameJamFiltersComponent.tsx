import { isNsfw } from "../utils";
import { useEffect, useState } from "react";
import type { GameJamItem } from "../models/Gamejam";
import friendData from "../../data/json/friends.json"

type SortMode = "Date" | "Score" | "Duration";
type TeamSize = "Solo" | "Group";
type JamDuration = "1H" | "1D" | "3D" | "9D" | "1M" | "More";
type JamSFW = "SFW" | "NSFW"
type Engine = "Unity" | "Godot" | "Unreal Engine" | "Scratch" | "GB Studio" | "DirectX" | "PVSnesLib"
type Country = "Online" | "Canada" | "United Kingdom" | "Sweden" | "France" | "Japan" | "Denmark"

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

function toggleArrayElement(array: any[], element: any) {
    if (array.includes(element)) {
        return array.filter(x => x !== element);
    }
    return [...array, element];
}

interface GameJamFiltersComponentProps
{
    items: GameJamItem[]
    setJamItems: React.Dispatch<React.SetStateAction<GameJamItem[]>>
}

export default function GameJamFiltersComponent({items, setJamItems}: GameJamFiltersComponentProps) {
    const nsfw = isNsfw();

    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [sortMode, setSortMode] = useState<SortMode>("Date");
    const [teamSize, setTeamSize] = useState<TeamSize[]>(["Solo", "Group"]);
    const [duration, setDuration] = useState<JamDuration[]>(["1D", "3D", "9D", "1M", "More"]);
    const [sfw, setSFW] = useState<JamSFW[]>(() => nsfw === "FullSFW" ? [ "SFW" ] : [ "SFW", "NSFW" ]);
    const [engines, setEngines] = useState<Engine[]>(["Unity", "Godot", "Unreal Engine", "Scratch", "GB Studio", "DirectX", "PVSnesLib"]);
    const [countries, setCountries] = useState<Country[]>(["Online", "Canada", "United Kingdom", "Sweden", "France", "Japan", "Denmark"])
    const [teammates, setTeammates] = useState<string[]>([])
    
    useEffect(() => {
        let jamSFW: Array<string>;
        if (!sfw) {
            const nsfwStatus = isNsfw();
            if (nsfwStatus === "FullSFW") jamSFW = [ "SFW" ];
            else jamSFW = [ "SFW", "NSFW" ];
        }
        else jamSFW = sfw;

        setJamItems(items
        .filter(x => (!x.nsfw && jamSFW.includes("SFW")) || (x.nsfw && jamSFW.includes("NSFW")))
        .filter(x => !engines || engines.includes(x.engine as Engine))
        .filter(x => !countries || countries.includes(x.location.split(", ").at(-1) as Country))
        .filter(x => !teamSize || (x.team.length === 1 && teamSize.includes("Solo")) || (x.team.length > 1 && teamSize.includes("Group")))
        .filter(x => !duration ||
            (x.duration <= 1 && duration.includes("1H")) ||
            (x.duration > 1 && x.duration <= 24 && duration.includes("1D")) ||
            (x.duration > 24 && x.duration <= 74 && duration.includes("3D")) ||
            (x.duration > 74 && x.duration <= 240 && duration.includes("9D")) ||
            (x.duration > 240 && x.duration <= 768 && duration.includes("1M")) ||
            (x.duration > 768 && duration.includes("More"))
        )
        .filter(x => !teammates ||
            teammates.every(t => x.team.includes(t))
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
        }));
    }, [ sortMode, teamSize, duration, sfw, engines, countries, teammates ]);

    if (!showFilters) return <button onClick={() => setShowFilters((x: boolean) => !x)}>Show filters</button>

    return <div className="is-flex flex-center-hor" id="jam-filters">
        <span className="jam-filter">
            <label htmlFor="sort-mode">Sort mode</label>
            <span id="sort-mode" className="button-group">
                <button title="Date" className="button-icon" disabled={sortMode === "Date"} onClick={_ => setSortMode("Date")}><span className="material-symbols-outlined">calendar_today</span></button>
                <button title="Score" className="button-icon" disabled={sortMode === "Score"} onClick={_ => setSortMode("Score")}><span className="material-symbols-outlined">leaderboard</span></button>
                <button title="Duration" className="button-icon" disabled={sortMode === "Duration"} onClick={_ => setSortMode("Duration")}><span className="material-symbols-outlined">timer</span></button>
            </span>
        </span>
        <span className="flex-break"></span>
        <span className="jam-filter">
            <label htmlFor="team-size">Team size</label>
            <span id="team-size" className="button-group">
                <button title="Solo" className={"button-icon " + (teamSize.includes("Solo") ? "active" : "")} onClick={_ => setTeamSize(toggleArrayElement(teamSize, "Solo"))}><span className="material-symbols-outlined">person</span></button>
                <button title="Group" className={"button-icon " + (teamSize.includes("Group") ? "active" : "")} onClick={_ => setTeamSize(toggleArrayElement(teamSize, "Group"))}><span className="material-symbols-outlined">groups</span></button>
            </span>
        </span>
        <span className="jam-filter">
            <label htmlFor="team-size">Duration</label>
            <span id="team-size" className="button-group">
                <button title="1 hour" className={"button-icon " + (duration.includes("1H") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "1H"))}>1H</button>
                <button title="≤1 day" className={"button-icon " + (duration.includes("1D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "1D"))}>1D</button>
                <button title="≤3 days" className={"button-icon " + (duration.includes("3D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "3D"))}>3D</button>
                <button title="≤9 days" className={"button-icon " + (duration.includes("9D") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "9D"))}>9D</button>
                <button title="≤1 month" className={"button-icon " + (duration.includes("1M") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "1M"))}>1M</button>
                <button title=">1 month" className={"button-icon " + (duration.includes("More") ? "active" : "")} onClick={_ => setDuration(toggleArrayElement(duration, "More"))}>M+</button>
            </span>
        </span>
        <span className="flex-break"></span>
        <span className="jam-filter">
            <label htmlFor="engines">Engines</label>
            <span id="engines" className="button-group">
                <button title="Unity" className={"button-icon " + (engines.includes("Unity") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "Unity"))}>UN</button>
                <button title="Unreal Engine" className={"button-icon " + (engines.includes("Unreal Engine") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "Unreal Engine"))}>UE</button>
                <button title="Godot" className={"button-icon " + (engines.includes("Godot") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "Godot"))}>GD</button>
                <button title="Scratch" className={"button-icon " + (engines.includes("Scratch") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "Scratch"))}>SC</button>
                <button title="GB Studio" className={"button-icon " + (engines.includes("GB Studio") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "GB Studio"))}>GB</button>
                <button title="DirectX" className={"button-icon " + (engines.includes("DirectX") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "DirectX"))}>DX</button>
                <button title="PVSnesLib" className={"button-icon " + (engines.includes("PVSnesLib") ? "active" : "")} onClick={_ => setEngines(toggleArrayElement(engines, "PVSnesLib"))}>SN</button>
            </span>
        </span>
        <span className="jam-filter">
            <label htmlFor="engines">Countries</label>
            <span id="engines" className="button-group">
                <button title="Online" className={"button-icon " + (countries.includes("Online") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "Online"))}>WEB</button>
                <button title="France" className={"button-icon " + (countries.includes("France") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "France"))}>FR</button>
                <button title="Denmark" className={"button-icon " + (countries.includes("Denmark") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "Denmark"))}>DK</button>
                <button title="United Kingdom" className={"button-icon " + (countries.includes("United Kingdom") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "United Kingdom"))}>GB</button>
                <button title="Canada" className={"button-icon " + (countries.includes("Canada") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "Canada"))}>CA</button>
                <button title="Sweden" className={"button-icon " + (countries.includes("Sweden") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "Sweden"))}>SE</button>
                <button title="Japan" className={"button-icon " + (countries.includes("Japan") ? "active" : "")} onClick={_ => setCountries(toggleArrayElement(countries, "Japan"))}>JP</button>
            </span>
        </span>
        <span className="flex-break"></span>
        <span className="jam-filter">
            <label htmlFor="teammates">Only made with</label>
            <span id="teammates" className="button-group">
            {
                friendData.filter(x => x.gamejam !== null).map(x =>
                    <button title={x.name} className={"button-icon " + (teammates.includes(x.gamejam) ? "active" : "")} onClick={_ => setTeammates(toggleArrayElement(teammates, x.gamejam))}>{x.name}</button>
                )
            }
            </span>
        </span>
        {
            nsfw === "FullSFW" ?
            <></> :
            <span className="jam-filter">
                <label htmlFor="team-size">Content&nbsp;warnings</label>
                <span id="team-size" className="button-group">
                    <button title="All-age" className={"button-icon " + (sfw.includes("SFW") ? "active" : "")} onClick={_ => setSFW(toggleArrayElement(sfw, "SFW"))}><span className="material-symbols-outlined">no_adult_content</span></button>
                    <button title="Adult content" className={"button-icon " + (sfw.includes("NSFW") ? "active" : "")} onClick={_ => setSFW(toggleArrayElement(sfw, "NSFW"))}><span className="material-symbols-outlined">18_up_rating</span></button>
                </span>
            </span>
        }
    </div>
}
