import { Assets, Sprite } from "pixi.js";

let isClicking = false;

export async function preview_initDrawAsync(app) {

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    app.stage.on("pointermove", (e) => {
        if (isClicking) {
            bunny.x = e.global.x;
            bunny.y = e.global.y;
        }
    });
    app.stage.on("pointerdown", (e) => {
        isClicking = true;
        bunny.x = e.global.x;
        bunny.y = e.global.y;
    });
    app.stage.on("pointerup", () => isClicking = false);

    app.ticker.add((time) =>
    {
        bunny.rotation += 0.1 * time.deltaTime;
    });
}