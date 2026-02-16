import { forwardRef, useEffect, useState } from "react";
import { getOverallScore, type GameJamItem } from "../GameJamForm";
import { isNsfw } from "../utils";
import { useLocation } from "react-router";

interface GameJamItemFormProps
{
    item: GameJamItem,
    showComputer: () => void
}

const GameJamItemForm = forwardRef((
    { item, showComputer }: GameJamItemFormProps,
    _
) => {
    const { hash } = useLocation();


    useEffect(() => {
        if (hash)
        {
            document.querySelector(hash)?.scrollIntoView();
        }
    }, []);

    let [previewGif, setPreviewGif] = useState<boolean>(false);

    let format = previewGif ? "webp" : (item.format ?? "jpg");
    let nsfwStatus = isNsfw();
    let hideNsfw = item.nsfw && nsfwStatus !== "NSFW";

    let pos = "";
    let comp = previewGif ? item.gifPosOverrides : item.imagePosOverrides;
    if (comp === "up") pos = "top";
    else if (comp === "down") pos = "bottom";
    else if (comp === "left") pos = "left";
    else if (comp === "right") pos = "right";

    let score = getOverallScore(item);

    return <div className={"card " + (item.name === hash.substring(1) ? "gamejam-highlight" : "")} id={item.name}>
        <p className={"text-center gamejam-name"}>{hideNsfw ? "" : item.fullName}</p>
        <div className={"gamejam-img is-flex flex-center-hor " + pos}>
            <img className={hideNsfw && item.name !== null  ? "blur" : ""} src={item.name === null ? "/img/ComingSoon.png" : `/data/img/gamejam/${item.name}.${format}`}
                onMouseEnter={_ => { if (!hideNsfw) setPreviewGif(true); }}
                onMouseLeave={_ => setPreviewGif(false) }
            />
        </div>
        <div className="gamejam-buttons is-flex">
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
            {
                item.github !== null && !hideNsfw ?
                <a href={item.github} target="_blank">
                    <button className="button-icon"><span className="material-symbols-outlined">code</span></button>
                </a>
                : <></>
            }
        </div>
        <p className="gamejam-event text-center">
            { item.event }
        </p>
        <div className="gamejam-content flex-columns">
            <div className="gamejam-col is-flex">
                <div className="gamejam-item is-flex">
                    <span className="material-symbols-outlined">globe</span>
                    <p>{ item.location.split(',').at(-1) }</p>
                </div>
                <div className="gamejam-item is-flex">
                    <span className="material-symbols-outlined">timer</span>
                    <p>{ item.duration } hour{ item.duration > 1 ? "s" : "" }</p>
                </div>
                <div className="gamejam-item is-flex">
                    <span className="material-symbols-outlined">feedback</span>
                    <p dangerouslySetInnerHTML={{ __html: item.theme.join("<br/>") }}></p>
                </div>
            </div>
            <div className="gamejam-col is-flex">
                <div className="gamejam-item is-flex">
                    <span className="material-symbols-outlined">settings</span>
                    <p>{ item.engine }</p>
                </div>
                <div className="gamejam-item is-flex">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <p>{ item.date }</p>
                </div>
                {
                    !score || (item.rating!.entriesRated && item.rating!.entriesRated <= 1) ? <div className="gamejam-item"></div>
                    : <div className="gamejam-item is-flex">
                        <span className="material-symbols-outlined">leaderboard</span>
                        <p>{ (score * 100).toFixed(1) }%</p>
                    </div>
                }
            </div>
        </div>
    </div>
});

export default GameJamItemForm;