import { randInt } from "../../../utils";
import { AScreen } from "./AScreen";

class Color {
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    equals(other: Color): boolean {
        return other.r === this.r
            && other.g === this.g
            && other.b === this.b;
    }

    r: number;
    g: number;
    b: number;
}

export class Gradient extends AScreen {

    color: Color
    targetColor: Color

    delta: number

    getRandomColor(): Color
    {
        return new Color(randInt(255), randInt(255), randInt(255));
    }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.clearRect = false;

        this.color = this.getRandomColor();
        this.targetColor = this.getRandomColor();
        this.delta = 0
    }

    getNumberToward(from: number, to: number, delta: number): number {
        if (from === to) return from;

        if (from < to) {
            from += delta;
            if (from > to) return to;
            return from; 
        } else {
            from -= delta;
            if (from < to) return to;
            return from; 
        }
    }

    render(deltaTime: number) {
        let d = deltaTime / 1000;
        if (d > 1) d = 1;

        const oldDelta = this.delta;
        this.delta += d;

        this.color.r = this.getNumberToward(this.color.r, this.targetColor.r, deltaTime / 10);
        this.color.g = this.getNumberToward(this.color.g, this.targetColor.g, deltaTime / 10);
        this.color.b = this.getNumberToward(this.color.b, this.targetColor.b, deltaTime / 10);
        if (this.color.equals(this.targetColor)) this.targetColor = this.getRandomColor();

        const midX = this.canvas.width / 2;
        const midY = this.canvas.height / 2;

        if (this.mouseX)
        {
            this.delta = Math.atan2(this.mouseY! - midY, this.mouseX! - midX)

            while (this.delta - oldDelta > Math.PI) this.delta -= 2 * Math.PI;
            while (this.delta - oldDelta < -Math.PI) this.delta += 2 * Math.PI;
        }
        if (this.delta >= oldDelta) {
            for (let i = oldDelta; i < this.delta; i += 0.001) this.drawLine(midX, midY, i);
        } else {
            for (let i = oldDelta; i > this.delta; i -= 0.001) this.drawLine(midX, midY, i);
        }
    }

    drawLine(midX: number, midY: number, angle: number) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgb(${Math.round(this.color.r)}, ${Math.round(this.color.g)}, ${Math.round(this.color.b)})`;
        this.ctx.moveTo(midX, midY);
        this.ctx.lineTo(midX + Math.cos(angle) * this.canvas.width, midY + Math.sin(angle) * this.canvas.width);
        this.ctx.stroke();
    }

    setMousePos(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }
}