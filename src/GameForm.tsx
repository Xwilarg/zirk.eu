import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import GameIntroComponent from "./components/intro/GameIntroComponent";
import gameData from "../data/json/game.json";
import { useState } from "react";
import ImageModalForm from "./modal/ImageModalForm";

export default function GameForm() {
    const [preview, setPreview] = useState<string | null>(null);

    return <>
        <QuoteComponent/>
        <GameIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Game</p>
            <h2>Train</h2>
            <div className="is-flex">
            {
                gameData.train.map(x => <div className="box game-img clickable" onClick={_ => setPreview(`/data/img/game/train/${x.image}`)}>
                    <img src={`/data/img/game/train/${x.image}`} />
                </div>)
            }
            </div>
            <h2>Sheep</h2>
            <div className="is-flex">
            {
                gameData.sheep.map(x => <div className="box game-img clickable" onClick={_ => setPreview(`/data/img/game/sheep/${x.image}`)}>
                    <img src={`/data/img/game/sheep/${x.image}`} />
                </div>)
            }
            </div>
            <h2>Dragon</h2>
            <div className="is-flex">
            {
                gameData.dragon.map(x => <div className="box game-img clickable" onClick={_ => setPreview(`/data/img/game/dragon/${x.image}`)}>
                    <img src={`/data/img/game/dragon/${x.image}`} />
                </div>)
            }
            </div>
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}