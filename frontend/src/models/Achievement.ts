export interface AchievementItem
{
    id: string
    category: string
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