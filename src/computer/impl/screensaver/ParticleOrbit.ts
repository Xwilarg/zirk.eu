import { AScreen } from "./AScreen";

class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
    }

    x: number;
    y: number;

    vx: number;
    vy: number;
}

export class ParticleOrbits extends AScreen
{
    particles: Particle[];

    centerX: number;
    centerY: number;

    canvasCenterX: number;
    canvasCenterY: number;

    intervalSpawn: number;
    globalSpeed: number;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.canvasCenterX = this.canvas.width / 2;
        this.canvasCenterY = this.canvas.height / 2;

        this.centerX = this.canvasCenterX;
        this.centerY = this.canvasCenterY;
        this.globalSpeed = 0.001;

        this.particles = [];

        this.intervalSpawn = window.setInterval(this.spawnNewParticle.bind(this), 10);
        this.spawnNewParticle();
    }

    spawnNewParticle() {
        let size = (this.canvas.height > this.canvas.width ? this.canvas.width : this.canvas.height) / 2;
        for (let i = 0; i < 10; i++) {
            let p = new Particle();
            const angle = Math.random() * Math.PI * 2;
            p.x = Math.cos(angle) * size + this.canvas.width / 2;
            p.y = Math.sin(angle) * size + this.canvas.height / 2;

            this.particles.push(p);
        }

        if (this.particles.length >= 10000) clearInterval(this.intervalSpawn);
    }

    lerp(min: number, max: number, value: number): number {
        let x = value * (1 - min) / max;
        if (x < min) return min
        return min + x;
    }

    render(deltaTime: number): void {
        if (deltaTime > 500) deltaTime = 500; // If user is away for too long, huge deltaTime would make all particules disappear

        // Draw cursor
        if (this.mouseX !== null && this.mouseY !== null) {
            let mouseSize = 20;
            const gradient = this.ctx.createRadialGradient(this.mouseX, this.mouseY, 3, this.mouseX, this.mouseY, mouseSize / 2);
            gradient.addColorStop(0, "black");
            gradient.addColorStop(0.9, "transparent");
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(this.mouseX - mouseSize / 2, this.mouseY - mouseSize / 2, mouseSize, mouseSize);
        }

        // Draw particles
        this.centerX = this.mouseX ?? this.canvasCenterX;
        this.centerY = this.mouseY ?? this.canvasCenterY;

	    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let p of this.particles) {
            // Attempt to slow down particles when they are at close to the center
            //p.vx += deltaTime * this.globalSpeed * (p.x > this.centerX ? -1 : 1) * this.lerp(0.5, 200, Math.abs(p.x - this.centerX));
            //p.vy += deltaTime * this.globalSpeed * (p.y > this.centerY ? -1 : 1) * this.lerp(0.5, 200, Math.abs(p.x - this.centerY));
            
            let isOob = p.x < 0 || p.y < 0 || p.x >= this.canvas.width || p.y >= this.canvas.height;
            p.vx += deltaTime * this.globalSpeed * (p.x > this.centerX ? -1 : 1) * (isOob ? 10 : 1);
            p.vy += deltaTime * this.globalSpeed * (p.y > this.centerY ? -1 : 1) * (isOob ? 10 : 1);
            p.x += p.vx;
            p.y += p.vy;

            /* // Prevent OOB
            if (p.x < 0) p.x = 0;
            if (p.y < 0) p.y = 0;
            if (p.x >= this.canvas.width) p.x = this.canvas.width - 1;
            if (p.y >= this.canvas.height) p.y = this.canvas.height - 1;
            */

            if (!isOob) {
                let i = 4 * (Math.round(p.y) * this.canvas.width + Math.round(p.x));
                // RGBA
                imageData.data[i] = 255;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 255;
            }
        }
	    this.ctx.putImageData(imageData, 0, 0);
    }

    setMousePos(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }
}