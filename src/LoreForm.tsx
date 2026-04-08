import LoreIntroComponent from "./components/intro/LoreIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import loreData from "../data/json/lore.json";
import { useEffect, useState, type ReactElement } from "react";
import { useSearchParams } from "react-router";

export default function LoreForm() {
    const [loreHtml, setLoreHtml] = useState<ReactElement[]>([]);
    const [display, setDisplay] = useState<string>("");
    const [bubble, setBubble] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const share = searchParams.get("share");
        if (share)
        {
            setBubble(share);
        }
    }, []);

    useEffect(() => {
        let data: Array<ReactElement> = [];

        var bubbleInfo = loreData.bubbles.find(x => x.name === bubble);

        if (!bubbleInfo)
        {
            for (const b of loreData.bubbles)
            {
                data.push(<button key={b.name} onClick={() => {
                    setBubble(b.name);
                    setSearchParams(sp => {
                        sp.set("share", b.name);
                        return sp;
                    });
                }}>{b.name}</button>)
            }
        }
        else
        {
            setDisplay(bubbleInfo.name + (bubbleInfo.coauthors.length === 0 ? "" : ` (co-authored with ${bubbleInfo.coauthors.join(", ")})`) + `\n\n${bubbleInfo.description.join("\n")}`);
            data.push(<div key="back">
                {
                    <button className="button-icon-label" onClick={() => {
                        setBubble("");
                        setDisplay("");
                        setSearchParams(sp => {
                            sp.delete("share")
                            return sp;
                        });
                    }}>
                        <span className="material-symbols-outlined">
                            keyboard_return
                        </span>
                        <span className="label">Back</span>
                    </button>
                }
            </div>)
            for (let e of
                bubbleInfo.data
                    .sort((a, b) => a.category.localeCompare(b.category) * 100 + a.name.localeCompare(b.name))
            )
            {
                data.push(<div key={e.name}>
                    { <button className="button-icon-label" onClick={() => { setDisplay(e.description.join("\n")); }}>
                        <span className="material-symbols-outlined">
                            {loreData.categories[e.category].icon}
                        </span>
                        <span className="label">{e.name}</span>
                        </button> }
                </div>)
            }
        }

        setLoreHtml(data);
    }, [ bubble ]);

    return <>
        <QuoteComponent/>
        <LoreIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <textarea readOnly={true} className="readonly" id="lore-display" value={display}>
            </textarea>
            <div className="is-flex flex-center-hor">
                { loreHtml }
            </div>
            {
                bubble
                ? <div id="lore-symbols">
                    { Object.values(loreData.categories).map(x => <div><span className="material-symbols-outlined">{x.icon}</span>: {x.description}</div>) }
                </div>
                : <></>
            }
        </div>
    </>
}