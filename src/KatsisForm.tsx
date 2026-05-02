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
    thumbnailSmall: string
    urlFragment: string
}

export default function KatsisForm() {
    const [katsisProject, setKatsisProject] = useState<KatsisProject | null>(null);
    const [katsisHtml, setKatsisHtml] = useState<ReactElement[]>([]);

    let nsfwStatus = isNsfw();

    useEffect(() => {
        fetch('https://intranet.katsis.net/api/user/public/1')
        .then(resp => { if (resp.ok) return resp.json(); throw new Error(""); })
        .then(json => {
            json.games;
            setKatsisProject(json);
        })
        .catch(_ => {});
    }, [ ]);

    useEffect(() => {
        if (nsfwStatus === "FullSFW") return;

        let data: ReactElement[] = [];

        if (katsisProject)
        {
            for (let p of katsisProject!.games)
            {
                if (nsfwStatus === "NSFW")
                {
                    data.push(<div className="card" key={p.name}>
                        <h2 className="project-name">{p.name}</h2>
                        <span className="is-flex flex-center-hor">
                            <a target="_blank" href={`https://katsis.net/g/${p.urlFragment}`}>
                                <div className="katsis-bg" style={{
                                    backgroundImage: `url('https://cdn.katsis.net/${p.thumbnailSmall}')`
                                }}>
                                    <div className="katsis-img is-flex flex-center-hor">
                                        <img src={`https://cdn.katsis.net/${p.thumbnailSmall}`} />
                                    </div>
                                </div>
                            </a>
                        </span>
                    </div>);
                }
                else
                {
                    data.push(<div className="card" key={p.name}>
                        <h2 className="project-name"></h2>
                        <span className="is-flex flex-center-hor">
                            <div className="katsis-bg-sfw" style={{
                                    backgroundImage: `url('https://cdn.katsis.net/${p.thumbnailSmall}')`
                                }}>
                                    <div className="katsis-img-sfw">
                                    </div>
                                </div>
                        </span>
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