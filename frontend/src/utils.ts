export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function lerp(min: number, max: number, t: number): number {
    return min + t * (max - min)
}