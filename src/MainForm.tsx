import { Link } from "react-router"
import "../css/index.css"
import SketchForm from "./computer/ComputerForm"
import NavigationForm from "./NavigationForm"
import { useState } from "react";
import sheepData from "../data/json/sheep.json"

interface SheepInfo
{
    image: string
}

export default function MainForm() {
    let [showSheep, setShowSheep] = useState<boolean>(false);
    let [sheep, setSheep] = useState<SheepInfo[]>(sheepData);

    return <>
        <NavigationForm />
        <div className={showSheep ? "container enlarged" : "container"} id="intro">
            Welcome on my website, I am Zirk, a game and software developer<br/>
            <br/>
            I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to="/gamejam">participating at gamejams</Link><br/>
            I like lot of others little hobbies that I might hide around on this website at a future date<br/>
            <br/>
            And speaking of this website, ta-da here you are, it's still a big work in progress but hopefully it should come closer to an aesthetic I like<br/>
            On the meantime, I hope you enjoy your stay here :)<br/>
            <br/>
            If you scrolled up here, why not contributing to my <a onClick={_ => setShowSheep(x => !x)}>sheep collection</a>?
            <br/>
            {
                showSheep ?
                <div className="is-flex">
                    {
                        sheep.map(x => 
                            <div className="sheep-img">
                                <img src={`/data/img/sheep/${x.image}`} />
                            </div>
                        )
                    }
                </div>
                : <></>
            }
        </div>
        <SketchForm />
    </> 
}