import { AScreen } from "./AScreen";

export class Waves extends AScreen
{
    render(deltaTime: number): void {
        let centerX = this.canvas.width / 2;
        let centerY = this.canvas.height / 2;
        let size = 20;
        this.ctx.fillStyle = "red";
/*
        int x = radius-1;
    int y = 0;
    int dx = 1;
    int dy = 1;
    int err = dx - (radius << 1);

    while (x >= y)
    {
        putpixel(x0 + x, y0 + y);
        putpixel(x0 + y, y0 + x);
        putpixel(x0 - y, y0 + x);
        putpixel(x0 - x, y0 + y);
        putpixel(x0 - x, y0 - y);
        putpixel(x0 - y, y0 - x);
        putpixel(x0 + y, y0 - x);
        putpixel(x0 + x, y0 - y);

        if (err <= 0)
        {
            y++;
            err += dy;
            dy += 2;
        }
        
        if (err > 0)
        {
            x--;
            dx += 2;
            err += dx - (radius << 1);
        }
    }
*/
        throw new Error("Method not implemented.");
    }

    setMousePos(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }
}