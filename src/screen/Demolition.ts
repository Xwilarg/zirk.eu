import { lerp } from "../utils";
import { AScreen } from "./AScreen";

class Particle
{
    x: number;
    y: number;
    vx: number;
    vy: number;

    orrX: number;
    orrY: number;
    destX: number;
    destY: number;

    isStatic: number; // 0: static: 1: dynamic: 2: coming bacl
    timer: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.orrX = x;
        this.orrY = y;
        this.isStatic = 0;
        this.timer = 0;
    }
}

class Ball
{
    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = 30;
        this.radius = this.size / 2;
    }

    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    radius: number;
}

export class Demolition extends AScreen
{
    particles: Particle[];
    balls: Ball[];
    intervalBallSpawn: number;
    ballSpawnCount: number;

    constructor() {
        super();

        this.balls = [];
        this.spawnBall();
        this.intervalBallSpawn = setInterval(this.spawnBallTimer.bind(this), 50);
        this.ballSpawnCount = 1;

        this.particles = [];
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                this.particles.push(new Particle(x, y));
            }
        }
    }

    spawnBallTimer() {
        this.spawnBall();
        this.ballSpawnCount++;
        if (this.ballSpawnCount === 20) {
            clearInterval(this.intervalBallSpawn);
        }
    }

    spawnBall() {
        this.balls.push(new Ball(-35, this.canvas.height / 2, 5, Math.random() * 15 - 10));
    }

    waitAndTriggerRespawn() {
        clearInterval(this.intervalBallSpawn);
        this.intervalBallSpawn = setInterval(this.spawnBallTimer.bind(this), 50);
        this.ballSpawnCount = 0;
    }

    isPointInsideCircle(dx: number, dy: number, r: number): boolean {
        if (dx + dy <= r) return true;
        if (dx > r) return false;
        if (dy > r) return false;
        return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(r, 2);
    }

    render(deltaTime: number): void {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            let ball = this.balls[i];

            ball.vy += deltaTime * 0.01;
            ball.x += ball.vx * deltaTime * 0.1;
            ball.y += ball.vy * deltaTime * 0.1;

            if (ball.x - ball.radius > this.canvas.width || ball.y - ball.radius > this.canvas.height) {
                this.balls.splice(i, 1);
                if (this.balls.length === 0) {
                    this.intervalBallSpawn = setInterval(this.waitAndTriggerRespawn.bind(this), 2500);
                }
            }

            this.ctx.fillStyle = "blue";
            this.ctx.beginPath();
            this.ctx.arc(ball.x + ball.radius, ball.y + ball.radius, ball.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }

	    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let p of this.particles) {
            if (p.isStatic === 0) {
                for (let ball of this.balls) {
                    // Is in the ball way?

                    let dx = Math.abs(p.x - (ball.x + ball.radius));
                    let dy = Math.abs(p.y - (ball.y + ball.radius));
                    if (this.isPointInsideCircle(dx, dy, ball.radius)) {
                        p.isStatic = 1;

                        // Propulse in opposite direction
                        let dirX = p.x - ball.x;
                        let dirY = p.y - ball.y;
                        const m = Math.sqrt(dirX * dirX + dirY * dirY);
                        p.vx = dirX / m * m;
                        p.vy = dirY / m * m;

                        // Slow down ball
                        ball.vx /= 1.0002;
                        ball.vy /= 1.0002;

                        break;
                    }
                }
            } else if (p.isStatic === 1) {
                p.timer += deltaTime * 0.0005;
                p.x += p.vx * deltaTime * 0.01;
                p.y += p.vy * deltaTime * 0.01;

                if (p.timer >= 1) {
                    p.timer = 0;
                    p.isStatic = 2;
                    p.destX = p.x;
                    p.destY = p.y;
                }
            } else {
                p.timer += deltaTime * 0.001;

                if (p.timer >= 1) {
                    p.timer = 1;
                    p.isStatic = 0;
                }

                p.x = lerp(p.destX, p.orrX, p.timer);
                p.y = lerp(p.destY, p.orrY, p.timer);

                if (p.isStatic === 0) p.timer = 0;
            }

            let isOob = p.x < 0 || p.y < 0 || p.x > this.canvas.width || p.y > this.canvas.height;
            if (!isOob) {
                let i = 4 * (Math.round(p.y) * this.canvas.width + Math.round(p.x));

                let alpha;
                if (p.isStatic === 0) alpha = 255;
                else if (p.isStatic === 1) alpha = lerp(255, 0, p.timer);
                else if (p.isStatic === 2) alpha = lerp(0, 255, p.timer);

                // RGBA
                if (p.isStatic > 0 && imageData.data[i] > 0) { // Go over static pixels
                    imageData.data[i] = 0;
                    imageData.data[i + 1] = 0;
                    imageData.data[i + 2] = 255;
                    imageData.data[i + 3] = alpha;
                } else if (p.isStatic > 0 && alpha > imageData.data[i + 3]) {
                    imageData.data[i] = 0;
                    imageData.data[i + 1] = 0;
                    imageData.data[i + 2] = 255;
                    imageData.data[i + 3] = alpha;
                } else if (p.isStatic === 0 && imageData.data[i + 2] === 0) {
                    imageData.data[i] = 255;
                    imageData.data[i + 1] = 0;
                    imageData.data[i + 2] = 0;
                    imageData.data[i + 3] = alpha;
                }
            }
        }
	    this.ctx.putImageData(imageData, 0, 0);
    }

    setMousePos(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }
}