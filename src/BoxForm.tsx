import { Link, useLocation, useSearchParams } from "react-router";
import BoxIntroComponent from "./components/intro/BoxIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import { getNavigationNoHook, isNsfw } from "./utils";
import friendData from "../data/json/friends.json"
import { useEffect, useState, type ReactElement } from "react";
import ImageModalForm from "./modal/ImageModalForm";

export default function BoxForm() {
    const [lifelineHtml, setLifelineHtml] = useState<ReactElement[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [preview, setPreview] = useState<string | null>(null);
    const { hash } = useLocation();

    const nsfwStatus = isNsfw();

    useEffect(() => {
        if (hash)
        {
            document.querySelector(hash)?.scrollIntoView();
        }
    }, [lifelineHtml]);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let p of friendData)
        {
            data.push(<>
                <h3 id={p.name}>{p.name}</h3>
                <span className="is-flex flex-center-hor">
                    <div className="goal-card box goal-box">
                        <h4>Gamejam</h4>
                        <span className="is-flex flex-center-hor">
                            <div className="goal-box-image">
                                {
                                    p.boxes.gamejam && (nsfwStatus !== "FullSFW" || !p.boxes.gamejam.nsfw)
                                    ? (
                                        p.boxes.gamejam.nsfw && nsfwStatus === "SFW"
                                        ? <img className="blur" src={`/data/img/gamejam/${p.boxes.gamejam.image}`} />
                                        : <Link to={getNavigationNoHook("/gamejam", searchParams, `#${p.boxes.gamejam.link}`)}><img src={`/data/img/gamejam/${p.boxes.gamejam.image}`} /></Link>
                                    )
                                    : <></>
                                }
                            </div>
                        </span>
                    </div>
                    <div className="goal-card box goal-box">
                        <h4>Travel</h4>
                        <span className="is-flex flex-center-hor">
                            <div className="goal-box-image">
                                {
                                    p.boxes.travel
                                    ? <img src={`/data/img/boxes/${p.boxes.travel}`} />
                                    : <></>
                                }
                            </div>
                        </span>
                    </div>
                    <div className="goal-card box goal-box">
                        <h4>Finish game in co-op</h4>
                        <span className="is-flex flex-center-hor">
                            <div className="goal-box-image">
                                {
                                    p.boxes.coop
                                    ? <a href={p.boxes.coop.link} target="_blank"><img src={`/data/img/boxes/${p.boxes.coop.image}`} /></a>
                                    : <></>
                                }
                            </div>
                        </span>
                    </div>
                </span>
            </>);
        }

        setLifelineHtml(data);
    }, []);

    return <>
        <QuoteComponent/>
        <BoxIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Boxes</p>
            <h3>Travel</h3>
            <span className="is-flex flex-center-hor">
                <div className="goal-card box goal-box">
                    <h4>Japan</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <img src="/data/img/boxes/Japan.jpg" className="clickable" onClick={e => setPreview((e.target as HTMLImageElement).src)} />
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Taiwan</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <img src="/data/img/boxes/Taiwan.jpg" className="clickable" onClick={e => setPreview((e.target as HTMLImageElement).src)} />
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Liechtenstein</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Costa Rica</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Chile</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Antartica</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
            </span>
            <h3>Gamejams</h3>
            <span className="is-flex flex-center-hor">
                <div className="goal-card box goal-box">
                    <h4>Without engine</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <Link to={getNavigationNoHook("/gamejam", searchParams, "#QuantumRanger")}><img src="/data/img/gamejam/QuantumRanger.jpg" /></Link>
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Hardware limitation</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>1st place (&gt; 20 entries)</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>In Japan</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <Link to={getNavigationNoHook("/gamejam", searchParams, "#RRR")}><img src="/data/img/gamejam/RRR.jpg" /></Link>
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>In Costa Rica</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>In Chile</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
            </span>
            <h3>Games</h3>
            <span className="is-flex flex-center-hor">
                <div className="goal-card box goal-box">
                    <h4>100% Games</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/1086940/" target="_blank"><img src={`/data/img/boxes/BaldursGate.jpg`} /></a>
                        </div>
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/333980/" target="_blank"><img src={`/data/img/boxes/AkibasTrip.jpg`} /></a>
                        </div>
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/102600/" target="_blank"><img src={`/data/img/boxes/OrcsMustDie.jpg`} /></a>
                        </div>
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/6220/" target="_blank"><img src={`/data/img/boxes/FlatOut.jpg`} /></a>
                        </div>
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/889510/" target="_blank"><img src={`/data/img/boxes/SenranKaguraBurst.jpg`} /></a>
                        </div>
                        <div className="goal-box-mult-image">
                            <a href="https://store.steampowered.com/app/1160220/" target="_blank"><img src={`/data/img/boxes/ParadiseKiller.jpg`} /></a>
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Do a speedrun</h4>
                    <span className="is-flex flex-center-hor">
                        <iframe width="560" height="220" src="https://www.youtube-nocookie.com/embed/KAtmTxX4OR8" frameBorder="0" allow=" picture-in-picture;" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Finish a randomizer</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-mult-image">
                            
                        </div>
                    </span>
                </div>
            </span>
            <h3>Katsis</h3>
            <span className="is-flex flex-center-hor">
                <div className="goal-card box goal-box">
                    <h4>Make a game on Steam</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Have an office</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Make a company</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                        </div>
                    </span>
                </div>
            </span>
            <h3>Lifeline</h3>
            { lifelineHtml }
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}