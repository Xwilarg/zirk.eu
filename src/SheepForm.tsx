import SheepIntroComponent from "./components/intro/SheepIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import plushiesData from "../data/json/plushies.json";
import { useEffect, useState, type ReactElement } from "react";

export default function SheepForm() {
    const [sheepGroup1Html, setSheepGroup1Html] = useState<ReactElement[]>([]);
    const [sheepGroup2Html, setSheepGroup2Html] = useState<ReactElement[]>([]);

    const countries: { [id: string] : string; } = {
        "United Kingdom": "gb",
        "France": "fr",
        "Italy": "it",
        "China": "cn",
        "Sweden": "se",
        "Norway": "no",
        "Netherlands": "nl",
        "Germany": "de",
        "Indonesia": "id",
        "Japan": "jp",
        "United States": "us",
        "Ireland": "ie"
    }

    function getSheepData(group: number): Array<ReactElement> 
    {
        let data: Array<ReactElement> = [];
        for (const p of plushiesData.filter(x => x.group === group))
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
        return data;
    }

    useEffect(() => {
        setSheepGroup1Html(getSheepData(1));
        setSheepGroup2Html(getSheepData(2));
    }, []);
    
    return <>
        <QuoteComponent/>
        <SheepIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Sheep</p>
            <h2>Group 1</h2>
            <div className="is-flex">
                { sheepGroup1Html }
            </div>
            <h2>Group 2</h2>
            <div className="is-flex">
                { sheepGroup2Html }
            </div>
        </div>
    </>
}