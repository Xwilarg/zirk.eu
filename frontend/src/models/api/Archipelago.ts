export interface ArchipelagoItem
{
    info: string[]
    with: ArchipelagoPersonItem[]
    start: string
}

interface ArchipelagoPersonItem
{
    name?: string
    game: string
    hints: string[]
    checks: number
    state: ArchipelagoState
    deathlink: boolean
}

type ArchipelagoState = "Pending";