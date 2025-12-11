import { forwardRef } from "react";
import type { GameJamItem } from "../GameJamForm";
import { isNsfw } from "../utils";

interface GameJamItemFormProps
{
    item: GameJamItem,
    showComputer: (defaultResFolder: string, defaultFilename: string, defaultEngine: string, defaultUnityVersion: string) => void
}

const GameJamItemForm = forwardRef((
    { item, showComputer }: GameJamItemFormProps,
    _
) => {
    let format = item.format ?? "jpg";
    let nsfwStatus = isNsfw();
    let hideNsfw = item.nsfw && nsfwStatus !== "NSFW";

    return <div className="card">
        <p className={"text-center gamejam-name" + (hideNsfw ? " blur" : "")}>{item.fullName}</p>
        <div className="gamejam-img is-flex flex-center-hor">
            <img className={hideNsfw ? "blur" : ""} src={`/data/img/gamejam/${item.name}.${format}`}/>
        </div>
        <div className="is-flex">
            {
                item.sketch !== null && !hideNsfw ?
                <button className="button-icon" onClick={
                    _ => {
                        showComputer(item.sketch!.folder, `Build/${item.sketch!.filename}`, item.engine, item.version);
                    }
                }><span className="material-symbols-outlined">play_arrow</span></button>
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
    </div>
});

export default GameJamItemForm;