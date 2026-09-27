import { useState } from "react";
import gameData from "../../data/json/game.json"
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";

export default function GameForm() {
    const [preview, setPreview] = useState<string | null>(null);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <h2>Train</h2>
        </div>
        <div className="is-flex flex-center-hor">
            {
                gameData.train.sort((a, b) => a.name.localeCompare(b.name)).map(x =>
                    <GenericBox key={x.name} name={x.name} image={`/data/img/game/train/${x.image}`} nsfw={false} onClick={() => setPreview(`/data/img/game/train/${x.image}`)}></GenericBox>
                )
            }
        </div>
        <div className="is-flex flex-center-hor">
            <h2>Sheep</h2>
        </div>
        <div className="is-flex flex-center-hor">
            {
                gameData.sheep.sort((a, b) => a.name.localeCompare(b.name)).map(x =>
                    <GenericBox key={x.name} name={x.name} image={`/data/img/game/sheep/${x.image}`} nsfw={false} onClick={() => setPreview(`/data/img/game/sheep/${x.image}`)}></GenericBox>
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