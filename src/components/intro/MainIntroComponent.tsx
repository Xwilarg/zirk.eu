import { Link } from "react-router"
import { useState } from "react";
import sheepData from "../../../data/json/sheep.json"
import { getNavigation } from "../../utils";

interface SheepLinkInfo
{
    name: string
    value: string
}

interface SheepInfo
{
    name: string
    image: string
    link: SheepLinkInfo
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
            Outside of programming, I have a decent amount of hobbies that I'm too shy to throw straight from this introduction, but feel free to look around if you're interested in that point!<br/>
            <br/>
            But one of them is making this website! It's still a big work in progress but there are already plenty to look around so I hope you enjoy your stay here :)<br/>
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
                                    {
                                        x.link.value.startsWith("https://")
                                        ? <a className="ignore" target="_blank" href={x.link.value}><p>{x.name}</p></a>
                                        : <p onClick={() => { alert(`${x.link.name}: ${x.link.value}`); }}>{x.name}</p>
                                    }
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
