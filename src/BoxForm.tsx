import { Link, useLocation, useSearchParams } from "react-router";
import BoxIntroComponent from "./components/intro/BoxIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import { getNavigation, getNavigationNoHook } from "./utils";
import friendData from "../data/json/friends.json"
import { useEffect, useState, type ReactElement } from "react";

export default function BoxForm() {
    const [lifelineHtml, setLifelineHtml] = useState<ReactElement[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { hash } = useLocation();

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
                <span className="is-flex">
                    <div className="goal-card box goal-box">
                        <h4>Presential gamejam</h4>
                        <span className="is-flex flex-center-hor">
                            <div className="goal-box-image">
                                {
                                    p.boxes.gamejam
                                    ? <Link to={getNavigationNoHook("/gamejam", searchParams, `#${p.boxes.gamejam.split('.')[0]}`)}><img src={`/data/img/gamejam/${p.boxes.gamejam}`} /></Link>
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
                        <h4>Finish co-op game</h4>
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
            <span className="is-flex">
                <div className="goal-card box goal-box">
                    <h4>Japan</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <img src="/data/img/boxes/Tokyo.jpg" />
                        </div>
                    </span>
                </div>
                <div className="goal-card box goal-box">
                    <h4>Taiwan</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
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
            <span className="is-flex">
                <div className="goal-card box goal-box">
                    <h4>Without engine</h4>
                    <span className="is-flex flex-center-hor">
                        <div className="goal-box-image">
                            <Link to={getNavigation("/gamejam", "#QuantumRanger")}><img src="/data/img/gamejam/QuantumRanger.jpg" /></Link>
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
                            <Link to={getNavigation("/gamejam", "#RRR")}><img src="/data/img/gamejam/RRR.jpg" /></Link>
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
            <h3>Katsis</h3>
            <span className="is-flex">
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
    </>
}