export interface NewsItem
{
    date: string
    title: string
    image: string
    orientation?: string
    text: string[]
    links: NewsLink[]
    nsfw: boolean
    css?: string
}

export interface NewsLink
{
    name: string
    link: string
}