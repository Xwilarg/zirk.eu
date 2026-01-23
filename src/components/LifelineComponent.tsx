import { useEffect, useState } from "react";
import friendData from "../../data/json/friends.json"

interface FriendData
{
    name: string,
    website: string | null,
    lifeline: string | LifelineData,
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

export default function LifelineComponent() {
    const [lifelineData, setLifelineData] = useState<FriendData[]>([]);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(true);

    useEffect(() => {
        fetch('/lifeline/status.php')
        .then(resp => resp.json())
        .then(json => {
            const data: FriendData[] = [];

            for (let d of friendData)
            {
                if (d.lifeline === "dynamic")
                {
                    console.log(json.find(x => x.name === d.name))
                    d.lifeline = {
                        id: json.find(x => x.name === d.name).id,
                        hash: null
                    };
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
                lifelineData.find(x => x.name === key)!.lifeline.id = json[key].id;
            }
            setLifelineData([...lifelineData]);
            setShowUpdateButton(false);
        });
    }

    return <div className="container box">
        <p className="mark">Lifeline</p>
        {
            lifelineData.map(x =>
                <div className="lifeline is-flex flex-center-ver">
                    {x.website ? <a href={x.website} target="_blank">{x.name}</a> : x.name}: {x.lifeline.id} {x.lifeline.hash ? <button className="button" onClick={_ => {
                        const hash = prompt("Enter your hash");
                        if (hash)
                        {
                            const finalStr = x.lifeline.id!.localeCompare(hash) < 0 ? `${x.lifeline.id}${hash}` : `${hash}${x.lifeline.id}`;
                            if (cyrb53(finalStr).toString() === x.lifeline.hash) {
                                alert("♥");
                            } else {
                                alert("Invalid ID");
                            }
                        }
                    }}><span className="material-symbols-outlined">check_circle</span></button> : ""}
                </div>
            )
        }
        {
            showUpdateButton ? <button className="button" onClick={updateDynamicLifelines}>Update</button> : <></>
        }
    </div>
}
