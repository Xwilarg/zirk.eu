export interface GameJamInfo
{
    jams: GameJamItem[]
}

export interface GameJamItem
{
    name: string,
    fullName: string,
    duration: number,
    engine: string,
    version: string,
    format?: string,
    nsfw: boolean,
    theme: string[],
    website: string | null,
    gameplay: string[],
    sketch: GamejamSketch | null,
    rating: GamejamRating | null,
    help: string[],
    controls: string[],
    date: string,
    location: string,
    github: string | null,
    event: string,
    shortEvent: string,
    imagePosOverrides?: string,
    gifPosOverrides?: string,
    postModification: string | null,
    team: string[]
}

export interface GamejamSketch
{
    folder: string,
    filename: string | null
}

export interface GamejamRating
{
    entries: number | null,
    entriesRated: number | null,
    scores?: { [id: string]: GamejamScore | undefined } | null;
}

export interface GamejamScore
{
    rank: number | null
}