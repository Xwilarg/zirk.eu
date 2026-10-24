export interface FriendItem
{
    name: string
    lit: string
    meet: string
    gamejam: string
    lifeline: FriendLifelineItem

    boxes: { [id: string]: any }
}

export interface FriendLifelineItem
{
    name: string
    id: string
    type: string
}