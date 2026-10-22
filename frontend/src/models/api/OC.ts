export interface OCInfo
{
    artists: { [id: string] : string; }
    ocs: OCItem[]
}

export interface OCItem
{
    name: string
    metadata: OCMetadataInfo
    images?: OCImageInfo[]
}

interface OCMetadataInfo
{
    gender: string
    location: string
    species: string

    description?: string[]

    coauthors?: string[]
    folder?: string
    history?: string[]
    personality?: string[]
    sexuality?: string[]
    height?: number
    orientation?: string
    media?: OCMediaInfo[]
    power?: string
    versions?: OCVersionInfo[]
}

interface OCVersionInfo
{
    name: string
    description: string
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
    artist: string[]
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