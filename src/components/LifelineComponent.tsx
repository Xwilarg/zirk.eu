import { forwardRef, useEffect, useImperativeHandle, useState, type ReactElement } from "react";
import friendData from "../../data/json/friends.json"
import gameData from "../../data/json/game.json"

interface FriendData
{
    id: string
    name: string
    website: string | null
    lifeline: string | LifelineData
    gamejam: string
}

interface LifelineData
{
    id: string
    hash: string | null
}

// https://stackoverflow.com/a/52171480
const cyrb53 = (str: string, seed = 0): number => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const LifelineComponent = forwardRef((_, ref) => {
    const [lifelineData, setLifelineData] = useState<FriendData[]>([]);

    useImperativeHandle(ref, () => {
        return {
            update() {
                updateDynamicLifelines()
            }
        };
    }, [ lifelineData ]);

    useEffect(() => {
        fetch('/lifeline/status.php')
        .then(resp => resp.json())
        .then(json => {
            const data: FriendData[] = [];

            for (let d of friendData)
            {
                if (d.lifeline?.type === "dynamic")
                {
                    d.lifeline.id = json.find(x => x.name === d.lifeline?.name)?.id ?? "Broken :(";
                }
                data.push(d);
            }

            setLifelineData(data);
        })
        .catch(_ => {
            const data: FriendData[] = [];

            for (let d of friendData)
            {
                if (d.lifeline?.type === "dynamic")
                {
                    d.lifeline.id = "Unknown";
                }
                data.push(d);
            }

            setLifelineData(data);
        });
    }, [ ]);

    function updateDynamicLifelines() {
        fetch('/lifeline/send.php')
        .then(resp => resp.json())
        .then(json => {
            for (let key of Object.keys(json)) {
                const match = lifelineData.find(x => x.lifeline?.name === key);
                
                if (match && match?.lifeline?.type === "dynamic") {
                    match.lifeline.id = json[key].id ?? "Broken :(";
                }
            }
            setLifelineData([...lifelineData]);
        });
    }

    function getGamejamColor(boxJson: any)
    {
        if (!boxJson) return 0;

        if (boxJson.duo && boxJson.offline) return 3;
        if (boxJson.duo || boxJson.offline) return 2;
        if (boxJson.catch) return 1;
        return 0;
    }

    function getTravelColor(boxJson: any)
    {
        if (!boxJson) 0;

        let score = 0;
        for (let [_, value] of Object.entries(boxJson)) {
            if (value) score++;
        }
        if (score >= 6) return 3;
        if (score >= 4) return 2;
        if (score >= 2) return 1;
        return 0;
    }

    function getGameColor(boxJson: any)
    {
        if (!boxJson) return 0;

        const score =
            (boxJson.time >= 10 ? 1 : 0) +
            (boxJson.duo ? 1 : 0) +
            (boxJson.full ? 1 : 0);
        if (score === 0) return 0;
        if (score === 1) return 1;
        if (score === 2) return 2;
        return 3;
    }

    function getScreenshotsColor(id: string)
    {
        const count = [
            ...gameData.sheep.filter(x => x.with.includes(id)),
            ...gameData.train.filter(x => x.with.includes(id))
        ].length;
        if (count === 0) return 0;
        if (count <= 5) return 1;
        if (count <= 10) return 2;
        return 3;
    }

    interface LifelineBoxInfo
    {
        scoreJam: number
        scoreTravel: number
        scoreGame: number
        scoreSC: number

        html?: ReactElement
    }

    return <div className="is-flex">
        {
            lifelineData.map(x =>
            {
                let info: LifelineBoxInfo = {
                    scoreJam: getGamejamColor(x.boxes.gamejam),
                    scoreTravel: getTravelColor(x.boxes.travel),
                    scoreGame: getGameColor(x.boxes.coop),
                    scoreSC: getScreenshotsColor(x.id)
                }
                info.html = <div key={x.id} className="lifeline is-flex flex-center-ver">
                    <div>
                        <div className="lifeline-title is-flex flex-center-ver">
                            <span className="lifeline-name">{x.name}</span> {x.lifeline.hash ? "" : <span className="lifeline-hash">{x.lifeline.id}</span>} {x.lifeline.hash ? <button className="button" onClick={_ => {
                                const hash = prompt("Enter your hash");
                                if (hash)
                                {
                                    const finalStr = x.lifeline.id!.localeCompare(hash) < 0 ? `${x.lifeline.id}${hash}` : `${hash}${x.lifeline.id}`;
                                    //console.log(cyrb53(finalStr).toString())
                                    if (cyrb53(finalStr).toString() === x.lifeline.hash) {
                                        alert("♥");
                                    } else {
                                        alert("Invalid ID");
                                    }
                                }
                            }}><span className="material-symbols-outlined">check_circle</span></button> : ""}
                        </div>
                        <div>
                            <span className={`material-symbols-outlined lifeline-icon-${info.scoreJam}`}>code</span>
                            <span className={`material-symbols-outlined lifeline-icon-${info.scoreJam}`}>travel</span>
                            <span className={`material-symbols-outlined lifeline-icon-${info.scoreGame}`}>joystick</span>
                            <span className={`material-symbols-outlined lifeline-icon-${info.scoreSC}`}>image</span>
                        </div>
                    </div>
                </div>;
                return info;
            }).sort((a, b) => (b.scoreJam + b.scoreTravel + b.scoreGame + b.scoreSC) - (a.scoreJam + a.scoreTravel + a.scoreGame + a.scoreSC)).map(x => x.html)
        }
    </div>
});

export default LifelineComponent;