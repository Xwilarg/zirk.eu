import { useEffect, useState } from "react";
import QuoteComponent from "../components/QuoteComponent";
import { Link, useSearchParams } from "react-router";
import { getNavigationNoHook, isNsfw, isNsfwNumber } from "../utils";
import GenericBox from "../boxes/GenericBox";
import ImageModalForm from "../components/modal/ImageModalForm";
import SketchForm from "../computer/SketchForm";
import NewsBox from "../boxes/impl/NewsBox";
import type { GameJamItem } from "../models/api/Gamejam";
import { getCssModifier, getOverallScore } from "../boxes/impl/GameJamBox";
import { NavigationLinks } from "../components/NavbarComponent";

// @ts-ignore
import "../../css/title.css";
import { UnlockAchievement } from "../models/Achievement";
import { useApi } from "../api/useApi";
import type { NewsItem } from "../models/api/News";
import type { SheepItem } from "../models/api/Sheep";
import type { ProjectItem } from "../models/api/Project";

export default function MainForm() {
    const [searchParams] = useSearchParams();
    const [showSheep, setShowSheep] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [showAllNews, setShowAllNews] = useState(false);
    const [ unlocked, setUnlocked ] = useState<string[]>(JSON.parse(localStorage.getItem("achievements") ?? "[]"));

    const nsfw = isNsfw();
    const nsfwNb = isNsfwNumber();
    const api = useApi();

    const [projects, setProjects] = useState<ProjectItem[] | null>(null);
    const [sheep, setSheep] = useState<SheepItem[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [achievements, setAchievements] = useState<null>(null);
    
    const [gamejams, setGamejams] = useState<GameJamItem[] | null>(null);
    const [gamejamsBest, setGamejamsBest] = useState<GameJamItem[] | null>(null);
    const [ projectIndex, setProjectIndex ] = useState(0);

    const [ katsisApiData, setKatsisApiData ] = useState<any[] | null>(null);

    useEffect(() => {
        if (projects === null) return;

        const interval = setInterval(() => {
            setProjectIndex(x => x == projects.length - 1 ? 0 : x + 1)
        }, 5000);

        return () => {
            clearInterval(interval)
        }
    }, [ projects ]);

    useEffect(() => {
        if (showSheep) {
            UnlockAchievement("SHOW_SHEEP");
            setUnlocked(JSON.parse(localStorage.getItem("achievements") ?? "[]"));
        }
    }, [ showSheep ])

    useEffect(() => {
        api.getGamejams(nsfwNb).then(x => {
            setGamejams(x);
            setGamejamsBest([...x].sort((a, b) => {
                const sa = getOverallScore(a);
                const sb = getOverallScore(b)

                if (sa === null) return 1;
                if (sb === null) return -1;

                return sa - sb;
            }))
        });
        api.getNews(nsfwNb).then(x => setNews(x));
        api.getProjects(nsfwNb).then(x => setProjects(x));

        if (nsfw !== "FullSFW")
        {
            fetch("https://intranet.katsis.net/api/project/public/user/1/all").then(x => x.json())
            .then(json => {
                setKatsisApiData(json)
            });
        }
    }, []);

    useEffect(() => {
        if (showSheep && sheep.length === 0) {
            api.getSheep().then(x => setSheep(x));
        }
    }, [showSheep])
    

    return <div>
        <QuoteComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Sketch" nsfw={false} className="card-first" custom={ <SketchForm isOn={false} loadedGame={null} buttons={[]} isFullscreen={false} onLoad={null} /> } />
            <GenericBox name="Intro" nsfw={false} className="card-first" custom={<div>
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
                <GenericBox name="Sheep" nsfw={false} className="card-dynamic-1" custom={<div className="is-flex">
                    {
                        sheep.map(x =>
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
            <GenericBox name="Navigation" nsfw={false} className="card-dynamic-1" custom={<nav className="is-flex">
                {
                    NavigationLinks.map(x => <Link key={x.to} to={getNavigationNoHook(x.to, searchParams)} rel="me" className="button nav-button">{x.label}</Link>)
                }
            </nav>} />
            <GenericBox name="Gamejam" nsfw={false} className="card-dynamic-2"
                custom={
                gamejams === null ? <>Loading...</> :
                <>
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
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejamsBest![0], false)}`}><img key={gamejamsBest![0].name} className={nsfw === "SFW" && gamejamsBest![0].nsfw ? "blur" : "" } src={`/data/img/gamejam/${gamejamsBest![0].name}.${gamejamsBest![0].format ?? "jpg"}`} /></div></td>
                            </tr>
                            <tr>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejams[1], false)}`}><img key={gamejams[1].name} className={nsfw === "SFW" && gamejams[1].nsfw ? "blur" : ""} src={`/data/img/gamejam/${gamejams[1].name}.${gamejams[1].format ?? "jpg"}`} /></div></td>
                                <td><div className={`card-img gamejam-main-img is-flex flex-center-hor ${getCssModifier(gamejamsBest![1], false)}`}><img key={gamejamsBest![1].name} className={nsfw === "SFW" && gamejamsBest![1].nsfw ? "blur" : ""} src={`/data/img/gamejam/${gamejamsBest![1].name}.${gamejamsBest![1].format ?? "jpg"}`} /></div></td>
                            </tr>
                        </tbody>
                    </table>
                </>}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/gamejam" }]}
            />
            <GenericBox name="Projects" nsfw={false} className="card-dynamic-3" text={projects === null ? "Loading..." : undefined}
                image={projects === null ? null : `/data/img/projects/${projects[projectIndex].images[0].name}`} onClick={projects === null ? undefined : () => setPreview(`/data/img/projects/${projects[projectIndex].images[0].name}`)}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/project" }]}
            />
            {
                nsfw === "FullSFW"
                ? <></>
                :
                <GenericBox name="Katsis" nsfw={false} className="card-dynamic-4"
                    custom={katsisApiData ? <div className="is-flex flex-center-hor">
                        {
                            katsisApiData.slice(0, 8).map(x => <div className="card-img katsis-main-img is-flex flex-center-hor"><img key={x.id} className={nsfw === "SFW" ? "blur" : ""} src={`https://cdn.katsis.net/${x.thumbnailSmall.filename}`} /></div>)
                        }
                    </div> : undefined} text={katsisApiData ? undefined : "Loading..."}
                    buttons={nsfw === "NSFW" ? [{label: "See more", type: "LinkExternal", labelType: "Text", color: "Primary", link: "https://zirk.katsis.net/" }] : []}
                />
            }
            <GenericBox name="" nsfw={false} className="card-placeholder"
                custom={<>
                    <h1 className="text-center" onClick={() => UnlockAchievement("CLICK_ZIRK")}>Zirk</h1>
                </>}
            />
            <GenericBox name="Achievements" nsfw={false} className="card-dynamic-5"
                text={achievements === null ? "Loading..." : `Unlocked: ${unlocked.filter(x => achievementData.some(y => y.id === x)).length} / ${achievementData.length}`}
                buttons={[{label: "See more", type: "LinkInternal", labelType: "Text", color: "Primary", link: "/achievement" }]}
            />
        </div>
        <div className="is-flex flex-center-hor">
            <h2>News</h2>
        </div>
        <div className="is-flex flex-center-hor">
            {
                showAllNews ? news.map(x => <NewsBox item={x} setPreview={setPreview} />) : news.filter(x => !x.nsfw || nsfw !== "FullSFW").slice(0, 5).map(x => <NewsBox item={x} setPreview={setPreview} />)
            }
        </div>
        {
            !showAllNews ?
            <div className="is-flex flex-center-hor up-margin">
                <button onClick={() => { setShowAllNews(true) }}>Show all</button>
            </div>
            : <></>
        }
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </div>
}