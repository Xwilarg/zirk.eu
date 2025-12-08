import { useRef } from "react";
import useScreenSaver from "./impl/ScreenSaver";
import useGameForm from "./impl/game/GameForm";

export default function SketchForm() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //useScreenSaver(canvasRef);
    useGameForm(canvasRef, "sketch/", "Sketch", "6000.2.12f1")

    return <>
        <div className="container" id="screen-container">
            <canvas ref={canvasRef} id="screen-canvas"></canvas>
        </div>
        <div className="container is-flex">
            <button><span className="material-symbols-outlined">power_settings_new</span></button>
            <button><span className="material-symbols-outlined">eject</span></button>
        </div>
        <div className="container is-flex"></div>
    </>
}