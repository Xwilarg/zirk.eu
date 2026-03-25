import LoreIntroComponent from "./components/intro/LoreIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import loreData from "../data/json/lore.json";
import { useEffect, useState, type ReactElement } from "react";

export default function LoreForm() {
    const [loreHtml, setLoreHtml] = useState<ReactElement[]>([]);
    const [display, setDisplay] = useState<string>("");

    useEffect(() => {
        let data: Array<ReactElement> = [];

        for (let e of
            loreData.bubbles.find(x => x.name === "Rhefir")!.data
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

        setLoreHtml(data);
    }, []);

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
        </div>
    </>
}