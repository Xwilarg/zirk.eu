export interface GoalCategoryItem
{
    data: { [name: string]: { [name: string]: GoalItem | null } }
}

interface GoalItem
{
    image?: string
    images?: string[]
    youtube?: string

    with: string[]
}