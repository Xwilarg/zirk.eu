export interface SheepItem
{
    name: string
    image: string
    link: SheepLink
    createDate: string
}

interface SheepLink
{
    name: string
    value: string
}