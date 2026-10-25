export interface ProjectItem
{
    name: string
    category: string
    images: ProjectImageItem[]
    links: ProjectLinkItem[]
    nsfw: boolean
}

interface ProjectImageItem
{
    name: string
    description: string
}

interface ProjectLinkItem
{
    name: string
    content: string
}

export interface ProjectCommitsItem
{
    lastCommitDate: Date
    lastCommitMessage: string
}