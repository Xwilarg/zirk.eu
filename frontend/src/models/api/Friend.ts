export interface FriendItem
{
    name: string
    meet: string
    gamejam: string
    lifeline: FriendLifelineItem

    boxes: { [id: string]: any }
}

export interface FriendLifelineItem
{
    type: string
}