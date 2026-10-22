import { useEffect, useState } from "react";
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";
import { UnlockAchievement } from "../models/Achievement";
import type { GameItem } from "../models/api/Game";
import { useApi } from "../api/useApi";
import { toTitleCase } from "../utils";

export default function GameForm() {
    const api = useApi();

    const [games, setGames] = useState<{ [id: string] : GameItem[]; }>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        api.getGames().then(x => { setGames(x); setFilter(Object.keys(x)[0]); });
    }, []);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            {
                Object.keys(games).map(x => <button key={x} onClick={() => { setFilter(x) }}>{ toTitleCase(x) }</button>)
            }
        </div>
        <br/>
        <div className="is-flex flex-center-hor">
            {
                filter === null ? <></> :
                games[filter].sort((a, b) => a.name.localeCompare(b.name)).map(x =>
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