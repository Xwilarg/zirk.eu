import { useEffect, useState } from "react";
import QuoteComponent from "../components/QuoteComponent";
import { Link, useSearchParams } from "react-router";
import { getNavigationNoHook, isNsfw } from "../utils";
import GenericBox from "../boxes/GenericBox";
import ImageModalForm from "../components/modal/ImageModalForm";
import SketchForm from "../computer/SketchForm";
import NewsBox from "../boxes/impl/NewsBox";
import type { GameJamItem } from "../models/Gamejam";
import { getCssModifier, getOverallScore } from "../boxes/impl/GameJamBox";
import { NavigationLinks } from "../components/NavbarComponent";

import gamejamData from "../../data/json/gamejam.json"
import projectData from "../../data/json/projects.json"
import sheepData from "../../data/json/sheep.json"
import newsData from "../../data/json/news.json"
import achievementData from "../../data/json/achievements.json"

// @ts-ignore
import "../../css/title.css";

export default function MainForm() {
    const [searchParams] = useSearchParams();
    const [showSheep, setShowSheep] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [ unlocked ] = useState<string[]>(JSON.parse(localStorage.getItem("achievements") ?? "[]"));

    const nsfw = isNsfw();
    
    const [gamejams] = useState<GameJamItem[]>(gamejamData.jams.filter(x => !x.nsfw || nsfw !== "FullSFW"));
    const [gamejamsBest] = useState<GameJamItem[]>([...gamejams].sort((a, b) => {
        const sa = getOverallScore(a);
        const sb = getOverallScore(b)

        if (sa === null) return 1;
        if (sb === null) return -1;

        return sa - sb;
    }));
    const [ projectIndex, setProjectIndex ] = useState(0);

    const [ katsisApiData, setKatsisApiData ] = useState<any[] | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setProjectIndex(x => x == projectData.length - 1 ? 0 : x + 1)
        }, 5000);

        return () => {
            clearInterval(interval)
        }
    }, [])
    
    if (nsfw !== "FullSFW")
    {
        useEffect(() => {
            fetch("https://intranet.katsis.net/api/project/public/user/1/all").then(x => x.json())
            .then(json => {
                setKatsisApiData(json)
            });
        }, []);
    }

    return <div>
        <QuoteComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Sketch" achievementId="CARD_SKETCH" nsfw={false} className="card-first" custom={ <SketchForm isOn={false} loadedGame={null} buttons={[]} isFullscreen={false} onLoad={null} /> } />
            <GenericBox name="Intro" achievementId="CARD_INTRO" nsfw={false} className="card-first" custom={<div>
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
                <GenericBox name="Sheep" achievementId="CARD_SHEEP" nsfw={false} className="card-first" custom={<div className="is-flex">
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
            <GenericBox achievementId="CARD_NAVIGATION" name="Navigation" nsfw={false} className="card-dynamic-1" custom={<nav className="is-flex">
                {
                    NavigationLinks.map(x => <Link to={getNavigationNoHook(x.to, searchParams)} rel="me" className="button nav-button">{x.label}</Link>)
                }
            </nav>} />
            <GenericBox achievementId="CARD_SUMMARY" name="Gamejam" nsfw={false} className="card-dynamic-2"
                custom={<>
                    <div className="text-center">{gamejams.length} entries</div>
                    <table className="table-2col">
                        <thead>
                            <tr>
                                <th>Latests</th>
                                <th>Bests</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejams[0], false)}`}><img key={gamejams[0].name} className={nsfw === "SFW" && gamejams[0].nsfw ? "blur" : ""} src={`/data/img/gamejam/${gamejams[0].name}.${gamejams[0].format ?? "jpg"}`} /></div></td>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejamsBest[0], false)}`}><img key={gamejamsBest[0].name} className={nsfw === "SFW" && gamejamsBest[0].nsfw ? "blur" : "" } src={`/data/img/gamejam/${gamejamsBest[0].name}.${gamejamsBest[0].format ?? "jpg"}`} /></div></td>
                            </tr>
                            <tr>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejams[1], false)}`}><img key={gamejams[1].name} className={nsfw === "SFW" && gamejams[1].nsfw ? "blur" : ""} src={`/data/img/gamejam/${gamejams[1].name}.${gamejams[1].format ?? "jpg"}`} /></div></td>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejamsBest[1], false)}`}><img key={gamejamsBest[1].name} className={nsfw === "SFW" && gamejamsBest[1].nsfw ? "blur" : ""} src={`/data/img/gamejam/${gamejamsBest[1].name}.${gamejamsBest[1].format ?? "jpg"}`} /></div></td>
                            </tr>
                        </tbody>
                    </table>
                </>}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/gamejam" }]}
            />
            <GenericBox name="Projects" achievementId="CARD_SUMMARY" nsfw={false} className="card-dynamic-3"
                image={`/data/img/projects/${projectData[projectIndex].images[0].name}`} onClick={() => setPreview(`/data/img/projects/${projectData[projectIndex].images[0].name}`)}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/project" }]}
            />
            <GenericBox name="Katsis" achievementId="CARD_KATSIS" nsfw={false} className="card-dynamic-4"
                custom={<div>
                    {
                        katsisApiData
                        ? 
                        <div className="is-flex flex-center-hor">
                            {
                                katsisApiData.slice(0, 8).map(x => <div className="card-img katsis-main-img is-flex flex-center-hor"><img key={x.id} className={nsfw === "SFW" ? "blur" : ""} src={`https://cdn.katsis.net/${x.thumbnailSmall.filename}`} /></div>)
                            }
                        </div>
                        : <div className="text-center"><br/><br/>Loading...</div>
                    }
                    </div>}
                buttons={nsfw === "NSFW" ? [{label: "See more", type: "LinkExternal", labelType: "Text", color: "Primary", link: "https://zirk.katsis.net/" }] : []}
            />
            <GenericBox name="" achievementId="CARD_NEUTRAL" nsfw={false} className="card-placeholder"
                custom={<>
                    <h1 className="text-center">Zirk</h1>
                </>}
            />
            <GenericBox name="Achievements" achievementId="CARD_SUMMARY" nsfw={false} className="card-last"
                text={`Unlocked: ${unlocked.filter(x => achievementData.some(y => y.id === x)).length} / ${achievementData.length}`}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/achievement" }]}
            />
        </div>
        <div className="is-flex flex-center-hor">
            <h2>News</h2>
        </div>
        <div className="is-flex flex-center-hor">
            {
                newsData.map(x => <NewsBox item={x} />)
            }
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </div>
}