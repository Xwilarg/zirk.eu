import { Application } from "pixi.js";
import { preview_initDrawAsync } from "../preview/draw";

export async function setupPixiAsync() {
    const app = new Application();
    await app.init({ background: '#1099bb', width: 500, height: 450 });
    document.getElementById("pixi-canvas").appendChild(app.canvas);

    await preview_initDrawAsync(app);
}