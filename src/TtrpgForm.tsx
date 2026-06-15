import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import { useEffect, useState, type ReactElement } from "react";
import TtrpgIntroComponent from "./components/intro/TtrpgIntroComponent";
import ttrpgData from "../data/json/ttrpg.json";

export default function TtrpgForm() {
    const [loreHtml, setLoreHtml] = useState<ReactElement[]>([]);
    const [displayedLore, setDisplayedLore] = useState<boolean[]>([]);

    useEffect(() => {
        let data: Array<boolean> = [];

        for (let i = 0; i < ttrpgData.lore.data.length; i++)
        {
            data.push(false);
        }

        setDisplayedLore(data);
    }, []);

    useEffect(() => {
        let data: Array<ReactElement> = [];

        for (let i = 0; i < ttrpgData.lore.data.length; i++)
        {
            data.push(<div className="box is-flex flex-center-hor flex-center-ver ttrpg-lore" key={ttrpgData.lore.data[i].title} onClick={() => {
                displayedLore[i] = !displayedLore[i];
                setDisplayedLore([...displayedLore]);
            }}>
                {
                    displayedLore[i]
                    ? ttrpgData.lore.data[i].content.join("\n")
                    : ttrpgData.lore.data[i].title
                }
            </div>)
        }

        setLoreHtml(data);
    }, [ displayedLore ]);

    return <>
        <QuoteComponent/>
        <TtrpgIntroComponent />
        <NavigationComponent />
        <div className="container box is-flex" id="ttrpg">
            <p className="mark">TTRPG</p>
            { loreHtml }
        </div>
    </>
}