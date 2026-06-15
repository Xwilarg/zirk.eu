import QuoteComponent from "./components/QuoteComponent";
import NavigationComponent from "./components/NavigationComponent";
import KatsisIntroComponent from "./components/intro/KatsisIntroComponent";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";
import SketchForm, { type SketchFormProps } from "./computer/SketchForm";
import { useSearchParams } from "react-router";
import type { ButtonInfo } from "./computer/impl/game/GameForm";

interface KatsisProject
{
    games: Array<KatsisProjectProject>
}

interface KatsisProjectProject
{
    name: string
    thumbnailSmall: string
    urlFragment: string
    webGL: KatsisProjectProjectWebgl
}

interface KatsisProjectProjectWebgl
{
    width: number
    height: number
    index: string
}

export default function KatsisForm() {
    const [katsisProject, setKatsisProject] = useState<KatsisProject | null>(null);
    const [katsisHtml, setKatsisHtml] = useState<ReactElement[]>([]);
    const [computerProps, setComputerProps] = useState<SketchFormProps | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const [shownIFrame, setShownIFrame] = useState<KatsisProjectProject | null>(null);
    const [buttons, setButtons] = useState<ButtonInfo[]>([]);

    let nsfwStatus = isNsfw();

    useEffect(() => {
        const game = searchParams.get("share")?.toUpperCase();

        if (game && katsisProject) {
            let target = katsisProject.games.find(x => x.name?.toUpperCase() === game);
            if (target && target.webGL) {
                setShownIFrame(target);
            } else {
                setShownIFrame(null);
            }
        } else {
            setShownIFrame(null);
        }
    }, [searchParams, katsisProject]);

    useEffect(() => {
        if (shownIFrame) {
            setComputerProps({
                isOn: true,
                loadedGame: `https://cdn.katsis.net/${shownIFrame.webGL.index}`,
                buttons: [],
                isFullscreen: false,
                onLoad: null
            });
        } else {
            setComputerProps(null);
        }
    }, [ shownIFrame ]);

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
                            <div className="katsis-bg" style={{
                                backgroundImage: `url('https://cdn.katsis.net/${p.thumbnailSmall}')`
                            }}>
                                <div className="katsis-img is-flex flex-center-hor">
                                    <img src={`https://cdn.katsis.net/${p.thumbnailSmall}`} />
                                </div>
                            </div>
                        </span>
                        <div className="gamejam-buttons is-flex">
                            {
                                p.webGL ?
                                <button className="button-icon" onClick={
                                    _ => {
                                        setSearchParams(sp => {
                                            sp.set("share", p.name);
                                            return sp;
                                        });
                                        window.scrollTo({
                                            top: 0,
                                            left: 0,
                                            behavior: "smooth"
                                        })
                                    }
                                }><span className="material-symbols-outlined">play_arrow</span></button>
                                : <></>
                            }
                            {
                                <a href={`https://katsis.net/g/${p.urlFragment}`} target="_blank">
                                    <button className="button-icon"><span className="material-symbols-outlined">language</span></button>
                                </a>
                            }
                        </div>
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


    useEffect(() => {
        if (shownIFrame) {
            let buttons: Array<ButtonInfo> = []

            if (searchParams.get("embed") !== "1") {
                    buttons.push({
                    name: "power_settings_new",
                    type: "Custom",
                    scene: () => {
                        setSearchParams(sp => {
                            sp.delete("share")
                            return sp;
                        });
                        searchParams.delete("share");
                    },
                    iconType: "icon",
                    disabled: false,
                    gameViewOnly: true
                });
            }

            buttons = buttons.concat([{
                name: "share",
                type: "Custom",
                scene: () => {
                    const shareUrl = new URL(window.location.href);
                    shareUrl.searchParams.set("embed", "1");
                    if (navigator.share)
                    {
                        navigator.share({url: shareUrl.href});
                    }
                    else
                    {
                        window.prompt("Copy to share", shareUrl.href)
                    }
                },
                iconType: "icon",
                disabled: false,
                gameViewOnly: true
            }]);
            setButtons(buttons);
        }
    }, [ shownIFrame ])

    if (searchParams.get("embed") === "1") {
        return computerProps !== null ?
            <SketchForm
                isOn={computerProps.isOn}
                loadedGame={computerProps.loadedGame}
                buttons={buttons}
                isFullscreen={false}
                onLoad={null}
            />
            : <></>
    }

    return <>
        <QuoteComponent/>
        <KatsisIntroComponent />
        <NavigationComponent />
        {
            computerProps !== null ?
            <SketchForm
                isOn={computerProps.isOn}
                loadedGame={computerProps.loadedGame}
                buttons={buttons}
                isFullscreen={false}
                onLoad={null}
            />
            : <></>
        }
        <div className="container box">
            <p className="mark">Katsis</p>
            <div className="is-flex flex-center-hor">
                { katsisHtml }
            </div>
        </div>
    </>
}