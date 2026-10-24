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
    id: string
    type: string
}