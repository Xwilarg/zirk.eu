import { Link } from "react-router"
import { useState } from "react";
import sheepData from "../../../data/json/sheep.json"
import { getNavigation } from "../../utils";

interface SheepInfo
{
    name: string,
    image: string
}

export default function MainIntroComponent() {
    let [showSheep, setShowSheep] = useState<boolean>(false);
    let [sheep, setSheep] = useState<SheepInfo[]>(sheepData);

    return <div className="container box">
        <p className="mark">Introduction</p>
        <div className={showSheep ? "enlarged" : ""} id="intro">
            Welcome on my website, I am Zirk, a game and software developer<br/>
            <br/>
            I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to={getNavigation("/gamejam")}>participating at gamejams</Link><br/>
            I like lot of others little hobbies that I might hide around on this website at a future date<br/>
            <br/>
            And speaking of this website, ta-da here you are, it's still a big work in progress but hopefully it should come closer to an aesthetic I like<br/>
            On the meantime, I hope you enjoy your stay here :)<br/>
            <br/>
            If you scrolled down there, why not contributing to my <a onClick={_ => setShowSheep(x => !x)}>sheep collection</a>?<br/>
            Send me your best drawn sheep at <a href="mailto:xwilarg@protonmail.com">xwilarg@protonmail.com</a> or on Discord (zirk)<br/>
            {
                showSheep ?
                <>
                    <br/>
                    <div className="is-flex">
                        {
                            sheep.map(x =>
                                <div className="sheep-img" key={x.name}>
                                    <p>{x.name}</p>
                                    <img src={`/data/img/sheep/${x.image}`} />
                                </div>
                            )
                        }
                    </div>
                </>
                : <></>
            }
        </div>
    </div>
}
