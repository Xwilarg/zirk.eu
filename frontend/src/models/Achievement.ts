export interface AchievementItem
{
    id: string
    name: string
    type: string
    html?: string
    image?: string
}

export function UnlockAchievement(key: string)
{
    const unlocked = JSON.parse(localStorage.getItem("achievements") ?? "[]") as string[];

    if (!unlocked.includes(key))
    {
        unlocked.push(key);
        localStorage.setItem("achievements", JSON.stringify(unlocked));
    }
}