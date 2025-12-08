import { randInt } from "../../../utils";
import { AScreen } from "./AScreen";

class Square
{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    speed: number;

    color: string;

    
    changeColor() {
        let r: number;
        let g: number;
        let b: number;
        do {
            r = randInt(256);
            g = randInt(256);
            b = randInt(256);

            // https://stackoverflow.com/a/12043228
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        } while (luma < 40);
        this.color = `rgb(${r} ${g} ${b})`;
    }

    setDirection(x: number, y: number) {
        const m = Math.sqrt(x * x + y * y);
        this.vx = x / m;
        this.vy = y / m;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.x = Math.floor(canvas.width / 2);
        this.y = Math.floor(canvas.height / 2);
        this.vx = 1;
        this.vy = 1;
        this.color = "#fff";

        const dir = Math.random() * 2 * Math.PI;
        this.setDirection(Math.cos(dir), Math.sin(dir));
        this.size = 25;
        this.speed = randInt(5) + 2;

        this.changeColor();
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

export class BallsScreen extends AScreen {
    squares: Square[];
    intervalBallSpawn: number;
    mouseSize: number;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.squares = [];
        this.mouseSize = 10;

        this.intervalBallSpawn = window.setInterval(this.spawnNewBall.bind(this), 1000);
        this.spawnNewBall();
    }

    render(deltaTime: number) {
        for (let sq of this.squares)
        {
            sq.x += (sq.speed * deltaTime / 10) * sq.vx;
            sq.y += (sq.speed * deltaTime / 10) * sq.vy;

            // Map bounds
            if (sq.x <= 0) {
                sq.x = 0;
                sq.vx = Math.abs(sq.vx);
                //sq.changeColor();
            }
            if (sq.y <= 0) {
                sq.y = 0;
                sq.vy = Math.abs(sq.vy);
                sq.changeColor();
            }
            if (sq.x >= this.canvas.width - 1 - sq.size) {
                sq.x = this.canvas.width - 1 - sq.size;
                sq.vx = -Math.abs(sq.vx);
                sq.changeColor();
            }
            if (sq.y >= this.canvas.height - 1 - sq.size) {
                sq.y = this.canvas.height - 1 - sq.size;
                sq.vy = -Math.abs(sq.vy);
                sq.changeColor();
            }

            // Check against mouse
            if (this.mouseX !== null && this.mouseY !== null) {
                if (Math.pow(this.mouseX - sq.x, 2) + Math.pow(this.mouseY - sq.y, 2) <= Math.pow(this.mouseSize / 2 + sq.size / 2, 2))
                {
                    // Reflect ball to right direction
                    const oX = this.mouseX - sq.x;
                    const oY = this.mouseY - sq.y;

                    sq.setDirection(-oX, -oY);
                }
            }
            
            // Check against others squares
            // https://stackoverflow.com/a/1736741
            for (let other of this.squares) {
                if (other.x == sq.x && other.y == sq.y) continue; // We assume this is us

                if (Math.pow(other.x - sq.x, 2) + Math.pow(other.y - sq.y, 2) <= Math.pow(other.size / 2 + sq.size / 2, 2))
                {
                    // Reflect ball to right direction
                    const oX = other.x - sq.x;
                    const oY = other.y - sq.y;

                    other.setDirection(oX, oY);
                    sq.setDirection(-oX, -oY);

                    let tmp = sq.speed;
                    sq.speed = other.speed;
                    other.speed = tmp;
                }
            }

            sq.render(this.ctx);
        }

        if (this.mouseX !== null && this.mouseY !== null) {
            this.ctx.strokeStyle = "white";
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX + this.mouseSize / 2, this.mouseY + this.mouseSize / 2, this.mouseSize / 2, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    setMousePos(x: number, y: number): void {
        this.mouseX = x - this.mouseSize / 2;
        this.mouseY = y - this.mouseSize / 2;
    }

    spawnNewBall() {
        this.squares.push(new Square(this.canvas));

        if (this.squares.length == 15) clearInterval(this.intervalBallSpawn);
    }
}