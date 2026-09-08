import { useState } from "react";
import QuoteComponent from "../components/QuoteComponent";
import { Link, useSearchParams } from "react-router";
import { getNavigationNoHook, isNsfw, randArrayElement } from "../utils";
import GenericBox from "../boxes/GenericBox";
import sheepData from "../../data/json/sheep.json"
import ImageModalForm from "../components/modal/ImageModalForm";
import SketchForm from "../computer/SketchForm";

export default function MainForm() {
    const [searchParams] = useSearchParams();
    const [showMore, setShowMore] = useState(false);
    const [showSheep, setShowSheep] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const nsfw = isNsfw();

    const [ gamejamImage ] = useState(`/data/img/recap/${randArrayElement(nsfw === "SFW" ? [ "Gamejam-01.png", "Gamejam-02.png", "Gamejam-03.png" ] : [ "Gamejam-01.png", "Gamejam-02.png", "Gamejam-03-NSFW.png" ])}`);
    const [ projectImage ] = useState(`/data/img/projects/${randArrayElement([ "Intranet-01.png", "GameGuesser-01.png", "Shika-01.png" ])}`);
    const [ katsisImage ] = useState(`/data/img/recap/${randArrayElement(nsfw === "SFW" ? [ "Katsis-01.png", "Katsis-02.png", "Katsis-03.png" ] : [ "Katsis-01-NSFW.png", "Katsis-02.png", "Katsis-03-NSFW.png" ])}`);

    return <div>
        <QuoteComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Sketch" nsfw={false} custom={ <SketchForm isOn={false} loadedGame={null} buttons={[]} isFullscreen={false} onLoad={null} /> } />
            <GenericBox name="Intro" nsfw={false} custom={<div>
                <h3>Welcome on <span className="gradient-highlight">my amazing website</span>, I am Zirk, a game and software developer</h3>
                I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to={getNavigationNoHook("/gamejam", searchParams)}>participating at gamejams</Link><br/>
                <br/>
                I overall like to work on lot of different projects, this website being on of them, so feel free to look around!<br/>
                <br/>
                Still there? then why not contributing to my sheep collection, please draw me one and send it to me!<br/>
                <a className="ignore" onClick={_ => setShowSheep(x => !x)}>You can also click here to see what I currently have</a><br/>
                <br/>
                <small>Contact: Discord (zirk) or by mail (<a href="mailto:xwilarg@protonmail.com">xwilarg@protonmail.com</a>)</small>
            </div>} />
            {
                showSheep ?
                <GenericBox name="Sheep" nsfw={false} custom={<div className="is-flex">
                    {
                        sheepData.map(x =>
                            <div className="sheep-img" key={x.name}>
                                {
                                    x.link.value.startsWith("https://")
                                    ? <a className="ignore" target="_blank" href={x.link.value}><p>{x.name}</p></a>
                                    : <p onClick={() => { alert(`${x.link.name}: ${x.link.value}`); }}>{x.name}</p>
                                }
                                <img className="clickable" src={`/data/img/sheep/${x.image}`} onClick={() => setPreview(`/data/img/sheep/${x.image}`)} />
                            </div>
                        )
                    }
                </div>} />
                : <></>
            }
            <GenericBox name="Navigation" nsfw={false} custom={<nav className="is-flex">    
                <Link to={getNavigationNoHook("/gamejam", searchParams)} rel="me" className="button nav-button">Gamejam</Link>
                <Link to={getNavigationNoHook("/project", searchParams)} rel="me" className="button nav-button">Projects</Link>
                <Link to={getNavigationNoHook("/game", searchParams)} rel="me" className="button nav-button">Games</Link>
                <Link to={getNavigationNoHook("/oc", searchParams)} rel="me" className="button nav-button">OCs</Link>
                <Link to={getNavigationNoHook("/info", searchParams)} rel="me" className="button nav-button">Info</Link>
            </nav>} />
            <GenericBox name="Gamejam" nsfw={false}
                image={gamejamImage} onClick={() => setPreview(gamejamImage)}
                buttons={[{label: "See more", type: "Link", labelType: "Text", color: "Primary", link: "/gamejam" }]}
            />
            <GenericBox name="Projects" nsfw={false}
                image={projectImage} onClick={() => setPreview(projectImage)}
                buttons={[{label: "See more", type: "Link", labelType: "Text", color: "Primary", link: "/project" }]}
            />
            <GenericBox name="Katsis" nsfw={false}
                image={katsisImage} onClick={() => setPreview(katsisImage)}
                buttons={nsfw === "NSFW" ? [{label: "See more", type: "Link", labelType: "Text", color: "Primary", link: "https://zirk.katsis.net/" }] : []}
            />
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </div>
}