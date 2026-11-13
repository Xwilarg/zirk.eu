import { forwardRef, useEffect, useImperativeHandle, useState, type ReactElement } from "react";
import type { GameItem } from "../models/api/Game";
import { useApi } from "../api/useApi";
import type { FriendItem, FriendLifelineItem } from "../models/api/Friend";
import type { GoalCategoryItem } from "../models/api/Goal";
import type { GameJamItem } from "../models/api/Gamejam";
import { isNsfw } from "../utils";

const LifelineComponent = forwardRef((_, ref) => {
    const api = useApi();
    
    const [lifelineData, setLifelineData] = useState<FriendItem[]>([]);
    const [gamejamData, setGamejamData] = useState<GameJamItem[]>([]);
    const [games, setGames] = useState<{ [id: string] : GameItem[] }>({});
    const [goals, setGoals] = useState<{ [id: string]: GoalCategoryItem }>({});

    useEffect(() => {
        api.getGames().then(x => setGames(x));
        api.getGamejams(1).then(x => setGamejamData(x));
        api.getFriends().then(x => {
            setLifelineData(x);

            fetch('/lifeline/status')
                .then(resp => resp.json())
                .then((json: FriendLifelineItem[]) => {
                    const data: FriendItem[] = [];

                    for (let d of x)
                    {
                        if (d.lifeline.type === "dynamic")
                        {
                            d.lifeline.id = json.find(x => x.name === d.lit)?.id ?? "Broken :(";
                        }
                        data.push(d);
                    }

                    setLifelineData(data);
                })
                .catch(_ => {
                    const data: FriendItem[] = [];

                    for (let d of x)
                    {
                        if (d.lifeline?.type === "dynamic")
                        {
                            d.lifeline.id = "Unknown";
                        }
                        data.push(d);
                    }

                    setLifelineData(data);
                });
        });
        api.getGoals().then(x => setGoals(x));
    }, []);

    useImperativeHandle(ref, () => {
        return {
            update() {
                updateDynamicLifelines()
            }
        };
    }, [ lifelineData ]);

    function updateDynamicLifelines() {
        fetch('/lifeline/send', {
            method: 'POST'
        })
        .then(resp => resp.json())
        .then((json: { [name: string]: FriendLifelineItem }) => {
            for (let key of Object.keys(json)) {
                const match = lifelineData.find(x => x.lit === key);
                
                if (match && match?.lifeline?.type === "dynamic") {
                    match.lifeline.id = json[key].id ?? "Broken :(";
                }
            }
            setLifelineData([...lifelineData]);
        });
    }

    function getGamejamColor(gamejamData: GameJamItem[])
    {
        let score = 0;

        if (gamejamData.some(x => x.team.length === 2 && x.duration >= 20)) score++;
        if (gamejamData.some(x => x.duration === 1)) score++;
        if (gamejamData.some(x => x.duration >= 24 && x.duration <= 72)) score++;
        if (gamejamData.some(x => x.duration >= 360)) score++;
        if (gamejamData.length >= 10) score += 3;
        else if (gamejamData.length >= 5) score += 2;
        else if (gamejamData.length >= 3) score += 1;

        return score / 7.0 * 255.0;
    }

    function getActivitiesColor(boxJson: any, countries: string[])
    {
        if (!boxJson) return 0;

        let score = 0;
        for (let [_, value] of Object.entries(boxJson)) {
            if (value) score++;
        }
        if (score >= 6) score = 3;
        else if (score >= 4) score = 2;
        else if (score >= 2) score = 1;

        if (countries.length > 3) score += 3;
        else score += countries.length;

        return score / 6.0 * 255.0;
    }

    function getGameColor(boxJson: any, id: string)
    {
        if (!boxJson) return 0;

        let score =
            (boxJson.time >= 10 ? 1 : 0) +
            (boxJson.duo ? 1 : 0) +
            (boxJson.full ? 1 : 0);


        const count = [
            ...games.sheep?.filter(x => x.with.includes(id)) ?? [],
            ...games.train?.filter(x => x.with.includes(id)) ?? []
        ].length;
        if (count <= 5) score += 1;
        else if (count <= 10) score += 2;
        else score += 3;

        return score / 6.0 * 255.0;
    }

    function getTimeColor(meet: Date)
    {
        const ms = Date.now() - meet.getTime();
        let years = ms / (1000 * 60 * 60 * 24 * 365.25);

        if (years > 10) return 3;
        if (years > 5) return 2;
        if (years > 2) return 1;
        return 0;
    }

    function getBoxColor(id: string)
    {
        let valid = 0;
        for (let [_category, content] of Object.entries(goals))
        {
            for (let subcategory of Object.values(content.data)) {
                for (let child of Object.values(subcategory))
                {
                    if (child !== null && child.with.includes(id)) valid++;
                }
            }
        }
        if (valid > 5) return 3;
        if (valid > 3) return 2;
        if (valid > 1) return 1;
        return 0;
    }

    interface LifelineBoxInfo
    {
        scoreJam: number
        scoreGame: number
        scoreActivities: number

        scoreTime: number
        scoreGoal: number

        html?: ReactElement
    }

    return <div className="is-flex">
        {
            lifelineData.map(x =>
            {
                let info: LifelineBoxInfo = {
                    scoreJam: getGamejamColor(gamejamData.filter(g => g.team.includes(x.gamejam))),
                    scoreGame: getGameColor(x.boxes.coop, x.lit),
                    scoreActivities: getActivitiesColor(x.boxes.activity, x.boxes.countries),

                    scoreTime: getTimeColor(new Date(x.meet)),
                    scoreGoal: getBoxColor(x.lit)
                }
                info.html = <div key={x.lit} className="lifeline is-flex flex-center-ver">
                    <div>
                        <div className="lifeline-title is-flex flex-center-ver">
                            <span className="lifeline-name">{x.name}</span> {x.lifeline.type === "static" ? "" : <span className="lifeline-hash">{x.lifeline.id}</span>} {x.lifeline.type === "static" ? <button className="button" onClick={_ => {
                                const hash = prompt("Enter your code");
                                if (hash)
                                {
                                    api.validatePath(x.lifeline.id, hash)
                                        .then(() => {
                                            alert("♥");
                                        })
                                        .catch(() => {
                                            api.unlockAchievement("LIFELINE_FAIL");
                                            alert("Invalid ID");
                                        })
                                }
                            }}><span className="material-symbols-outlined">check_circle</span></button> : ""}
                        </div>
                        <div>
                            <span className="lifeline-color" style={{
                                backgroundColor: `rgb(${info.scoreJam}, ${info.scoreGame}, ${info.scoreActivities})`
                            }}></span>
                        </div>
                    </div>
                </div>;
                return info;
            }).sort((a, b) => (b.scoreJam + b.scoreActivities + b.scoreGame + (b.scoreGoal / 3.0 * 255.0) + (b.scoreTime / 3.0 * 255.0)) - (a.scoreJam + a.scoreActivities + a.scoreGame + (a.scoreGoal / 3.0 * 255.0) + (a.scoreTime / 3.0 * 255.0))).map(x => x.html)
        }
    </div>
});

export default LifelineComponent;