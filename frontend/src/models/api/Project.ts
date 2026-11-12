export interface ProjectItem
{
    name: string
    description: string
    category: string
    images: ProjectImageItem[]
    links: ProjectLinkItem[]
    nsfw: boolean
    metadata: ProjectMetadataItem
}

interface ProjectMetadataItem
{
    end: string
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