import { useRef, useState } from "react";
import useScreenSaver from "./impl/ScreenSaver";
import useGameForm, { type ButtonInfo } from "./impl/game/GameForm";
import sketchData from "../../data/json/sketch.json"

export default function SketchForm() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [sketchButtons, setSketchData] = useState<ButtonInfo[]>(sketchData)

    //useScreenSaver(canvasRef);
    let sketchInstance = useGameForm(canvasRef, "sketch/", "Sketch", "6000.2.12f1");
    console.log(sketchInstance);

    return <>
        <div className="container" id="screen-container">
            <canvas ref={canvasRef} id="screen-canvas"></canvas>
        </div>
        <div className="container is-flex">
            <button><span className="material-symbols-outlined">power_settings_new</span></button>
            <button><span className="material-symbols-outlined">eject</span></button>
            {
                sketchButtons.map(x =>
                    <button key={x.name} onClick={() => { sketchInstance.current!.SendMessage('LevelLoader', 'LoadScene', x.scene) }}>{x.name}</button>
                )
            }
        </div>
        <div className="container is-flex"></div>
    </>
}