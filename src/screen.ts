import { AScreen } from "./screen/AScreen";
import { BallsScreen } from "./screen/BallsScreen";
import { ParticleOrbits } from "./screen/ParticleOrbits";
import { Demolition } from "./screen/Demolition";
import { randInt } from "./utils";

let screenAnim: AScreen;

function updateLoop() {
    screenAnim.updateCanvas();
    window.requestAnimationFrame(updateLoop);
}

export function setupScreen()
{
    let possibilities = [ BallsScreen, ParticleOrbits, Demolition ];
    screenAnim = new possibilities[randInt(possibilities.length)];
    document.addEventListener("mousemove", screenAnim.handleMouse.bind(screenAnim));
    window.requestAnimationFrame(updateLoop);
}