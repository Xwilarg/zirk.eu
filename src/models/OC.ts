export interface OCInfo
{
    name: string
    metadata: OCMetadataInfo
    images: OCImageInfo[]
}

interface OCMetadataInfo
{
    coauthors: string[]
    gender: string
    location: string
    folder: string
    description: string[]
    history?: string[]
    personality?: string[]
    sexuality?: string[]
    height: number
    species: string
    orientation: string
    media: OCMediaInfo[]
    power?: string
}

interface OCMediaInfo
{
    name: string
    image: string
    nsfw: boolean
}

interface OCImageInfo
{
    title: string
    with: string[]
    artist: string
    date: string | null
    default?: boolean
    images: OCImageDetailInfo[]
    type?: string
    hide?: boolean
}

interface OCImageDetailInfo
{
    link: string
    nsfw: boolean
    default?: boolean
}