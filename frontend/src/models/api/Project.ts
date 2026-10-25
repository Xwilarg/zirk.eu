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
    type: string
    content: string
}

export interface ProjectCommitsItem
{
    lastCommitDate: string
    lastCommitMessage: string
}