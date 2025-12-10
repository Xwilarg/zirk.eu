import { forwardRef } from "react";
import type { GameJamItem } from "../GameJamForm";
import { isNsfw } from "../utils";

interface GameJamItemFormProps
{
    item: GameJamItem
}

const GameJamItemForm = forwardRef((
    { item }: GameJamItemFormProps,
    _
) => {
    let format = item.format ?? "jpg";
    let nsfwStatus = isNsfw();
    let hideNsfw = item.nsfw && nsfwStatus !== "NSFW";

    return <div className="box">
        <p className="text-center">{item.fullName}</p>
        <div className="gamejam-img is-flex flex-center-hor">
            <img className={hideNsfw ? "blur" : ""} src={`/data/img/gamejam/${item.name}.${format}`}/>
        </div>
        {
            item.sketch !== null && !hideNsfw ?
            <button className="button-icon"><span className="material-symbols-outlined">play_arrow</span></button>
            : <></>
        }
        {
            item.website !== null && !hideNsfw ?
            <a href={item.website}>
                <button className="button-icon"><span className="material-symbols-outlined">language</span></button>
            </a>
            : <></>
        }
    </div>
});

export default GameJamItemForm;