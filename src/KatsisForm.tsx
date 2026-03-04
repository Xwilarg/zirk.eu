import QuoteComponent from "./components/QuoteComponent";
import NavigationComponent from "./components/NavigationComponent";
import KatsisIntroComponent from "./components/intro/KatsisIntroComponent";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";

interface KatsisProject
{
    games: Array<KatsisProjectProject>
}

interface KatsisProjectProject
{
    name: string
    thumbnail: string
}

export default function KatsisForm() {
    const [katsisProject, setKatsisProject] = useState<KatsisProject | null>(null);
    const [katsisHtml, setKatsisHtml] = useState<ReactElement[]>([]);

    let nsfwStatus = isNsfw();

    useEffect(() => {
        fetch('https://intranet.katsis.net/api/user/public/1')
        .then(resp => { if (resp.ok) return resp.json(); throw new Error(""); })
        .then(json => {
            json.games.reverse();
            setKatsisProject(json);
        })
        .catch(_ => {});
    }, [ ]);

    useEffect(() => {
        let data: ReactElement[] = [];

        if (katsisProject)
        {
            for (let p of katsisProject!.games)
            {
                if (nsfwStatus === "NSFW")
                {
                    data.push(<div className="card" key={p.name}>
                        <h2 className="project-name">{p.name}</h2>
                        <a target="_blank" href={`https://katsis.net/g/${p.thumbnail.split('/')[0]}`}>
                            <div className="project-img">
                                <img src={`https://cdn.katsis.net/${p.thumbnail}`} />
                            </div>
                        </a>
                    </div>);
                }
                else
                {
                    data.push(<div className="card" key={p.name}>
                        <h2 className="project-name"></h2>
                        <div className="project-img">
                            <img className="blur" src={`https://cdn.katsis.net/${p.thumbnail}`} />
                        </div>
                    </div>);
                }
            }
        }

        setKatsisHtml(data);
    }, [ katsisProject ]);

    return <>
        <QuoteComponent/>
        <KatsisIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Katsis</p>
            <div className="is-flex flex-center-hor">
                { katsisHtml }
            </div>
        </div>
    </>
}