import { useEffect, useState } from "react"
import NavigationForm from "./NavigationForm";
import staticLifeline from "../data/json/lifeline.json"

interface LifelineData
{
    name: string
    id: string | null
    hash: string
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

function getStaticLifelines(): LifelineData[] {
    return Object.entries(staticLifeline.statics).map(x => ({
       name: x[0],
       id: x[1].id,
       hash : x[1].hash
    }));
}

export default function LifelineForm() {
    const [lifelineData, setLifelineData] = useState<LifelineData[]>([]);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(true);

    useEffect(() => {
        fetch('/lifeline/status.php')
        .then(resp => resp.json())
        .then(json => setLifelineData([...json, ...getStaticLifelines()]));
    }, [ ]);

    function updateDynamicLifelines() {
        fetch('/lifeline/send.php')
        .then(resp => resp.json())
        .then(json => {
            for (let key of Object.keys(json)) {
                lifelineData.find(x => x.name === key)!.id = json[key].id;
            }
            setLifelineData([...lifelineData]);
            setShowUpdateButton(false);
        });
    }

    return <>
        <NavigationForm />
        {
            lifelineData.map(x =>
                <div className="lifeline is-flex flex-center-ver">
                    {x.name}: {x.id} {x.hash ? <button className="button" onClick={_ => {
                        const hash = prompt("Enter your hash");
                        if (hash)
                        {
                            const finalStr = x.id!.localeCompare(hash) < 0 ? `${x.id}${hash}` : `${hash}${x.id}`;
                            if (cyrb53(finalStr).toString() === x.hash) {
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
    </>
}