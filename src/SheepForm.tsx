import SheepIntroComponent from "./components/intro/SheepIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import plushiesData from "../data/json/plushies.json";
import { useEffect, useState, type ReactElement } from "react";

export default function SheepForm() {
    const [sheepHtml, setSheepHtml] = useState<ReactElement[]>([]);

    const countries = {
        "United Kingdom": "gb",
        "France": "fr",
        "Italy": "it",
        "China": "cn",
        "Sweden": "se",
        "Norway": "no",
        "Netherlands": "nl",
        "Germany": "de",
        "Indonesia": "id",
        "Japan": "jp"
    }

    useEffect(() => {
        let data: Array<ReactElement> = [];
        for (const p of plushiesData)
        {
            data.push(
            <div className="cardcard" key={p.name}>
                <h2>{p.name}</h2>
                <p>
                    <span title="Bought" className={`fi fi-${countries[p.bought]}`}></span>
                    <span title="Created" className={`fi fi-${countries[p.created]}`}></span>
                    {
                        p.made === null ? <></>
                        : <span title="Manufactured" className={`fi fi-${countries[p.made]}`}></span>
                    }
                </p>
                <div className="psheep-img">
                    <img src={`/data/img/plushies/${p.clean_name}.jpg`} />
                </div>
            </div>
            );
        }
        setSheepHtml(data);
    });
    
    return <>
        <QuoteComponent/>
        <SheepIntroComponent />
        <NavigationComponent />
        <div className="container box is-flex">
            <p className="mark">Sheep</p>
            { sheepHtml }
        </div>
    </>
}