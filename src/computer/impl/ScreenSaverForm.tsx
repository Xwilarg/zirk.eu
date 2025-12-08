import { useEffect, useRef } from "react";
import { AScreen } from "./screensaver/AScreen";
import { BallsScreen } from "./screensaver/BallsScreen";

export default function ScreenSaverForm() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const screenSaverRef = useRef<AScreen | null>(null);
    
    useEffect(() => {
        const sc = new BallsScreen(canvasRef.current!, 0);
        screenSaverRef.current = sc;

        document.addEventListener("mousemove", sc.handleMouse.bind(sc));
        window.requestAnimationFrame(updateLoop);
    }, []);

    function updateLoop() {
        screenSaverRef.current?.updateCanvas();
        window.requestAnimationFrame(updateLoop);
    }

    console.log("refresh")

    return <canvas ref={canvasRef} style={{
        height: 500
    }}></canvas>
}