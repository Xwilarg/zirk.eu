import { Application, FillGradient, Graphics } from 'pixi.js';

export async function setupLoreAsync() {
    const app = new Application();
    await app.init({ background: 'hsl(221, 14%, 9%)', resizeTo: document.getElementById("lore-container") });
    document.getElementById("lore-container").appendChild(app.canvas);

    {
        const gradient = new FillGradient({
            type: 'radial',
            colorStops: [
              { offset: 0, color: 'rgb(77, 126, 223)' },
              { offset: 1, color: 'hsl(221, 14%, 9%)' },
            ],
        });
          
        const obj = new Graphics().rect(100, 200, 200, 200)
            .fill(gradient);
        app.stage.addChild(obj);
    }
    {
        const gradient = new FillGradient({
            type: 'radial',
            colorStops: [
            { offset: 0, color: 'rgb(225, 84, 124)' },
            { offset: 1, color: 'hsl(221, 14%, 9%)' },
            ],
        });
        
        const obj = new Graphics().rect(300, 200, 200, 200)
            .fill(gradient);
        app.stage.addChild(obj);
    }
}