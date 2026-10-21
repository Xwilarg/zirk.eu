import { useState } from "react";
import gameData from "../../data/json/game.json"
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";
import { UnlockAchievement } from "../models/Achievement";

type Game = keyof typeof gameData;

export default function GameForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [filter, setFilter] = useState<Game>("train");

    let small = filter.toLowerCase();

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <button onClick={() => { setFilter("train") }}>Train</button>
            <button onClick={() => { setFilter("sheep") }}>Sheep</button>
        </div>
        <br/>
        <div className="is-flex flex-center-hor">
            {
                gameData[filter].sort((a, b) => a.name.localeCompare(b.name)).map(x =>
                    <GenericBox key={x.name} name={x.name} image={`/data/img/game/${filter}/${x.image}`} nsfw={false} onClick={() => {
                        setPreview(`/data/img/game/${filter}/${x.image}`)
                        if (filter === "train" && x.name === "Team Fortress 2") UnlockAchievement("TRAIN_FAVORITE_GAME")
                    }}></GenericBox>
                )
            }
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}