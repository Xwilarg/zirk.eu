import { forwardRef, useState } from "react";
import type { GameJamItem } from "../GameJamForm";
import { isNsfw } from "../utils";

interface GameJamItemFormProps
{
    item: GameJamItem,
    showComputer: () => void
}

const GameJamItemForm = forwardRef((
    { item, showComputer }: GameJamItemFormProps,
    _
) => {
    let [previewGif, setPreviewGif] = useState<boolean>(false);

    let format = previewGif ? "gif" : (item.format ?? "jpg");
    let nsfwStatus = isNsfw();
    let hideNsfw = item.nsfw && nsfwStatus !== "NSFW";

    let pos = "";
    let comp = previewGif ? item.gifPosOverrides : item.imagePosOverrides;
    if (comp === "up") pos = "top";
    else if (comp === "down") pos = "bottom";
    else if (comp === "left") pos = "left";
    else if (comp === "right") pos = "right";

    console.log(`/data/img/gamejam/${item.name}.${format}`)
    return <div className="card">
        <p className={"text-center gamejam-name"}>{hideNsfw ? "" : item.fullName}</p>
        <div className={"gamejam-img is-flex flex-center-hor " + pos}>
            <img className={hideNsfw ? "blur" : ""} src={`/data/img/gamejam/${item.name}.${format}`}
                onMouseEnter={_ => { if (!hideNsfw) setPreviewGif(true); console.log("test") }}
                onMouseLeave={_ => setPreviewGif(false) }
            />
        </div>
        <div className="is-flex">
            {
                item.sketch !== null && !hideNsfw ?
                <button className="button-icon" onClick={
                    _ => {
                        showComputer();
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
                item.website !== null && !hideNsfw ?
                <a href={item.website} target="_blank">
                    <button className="button-icon"><span className="material-symbols-outlined">language</span></button>
                </a>
                : <></>
            }
        </div>
    </div>
});

export default GameJamItemForm;