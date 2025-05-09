import { AScreen } from "./screen/AScreen";
import { BallsScreen } from "./screen/BallsScreen";



let screenAnim: AScreen;

function updateLoop() {
    screenAnim.updateCanvas();
    window.requestAnimationFrame(updateLoop);
}

export function setupScreen()
{
    screenAnim = new BallsScreen();
    document.addEventListener("mousemove", screenAnim.handleMouse.bind(screenAnim));
    window.requestAnimationFrame(updateLoop);
}