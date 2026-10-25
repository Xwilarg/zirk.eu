import GenericBox from "../GenericBox";
import type { ProjectCommitsItem, ProjectItem } from "../../models/api/Project";

interface ProjectItemFormProps
{
    item: ProjectItem
    commits: ProjectCommitsItem | null
    setPreview: (image: string) => void
}

export default function ProjectBox({ item, setPreview, commits }: ProjectItemFormProps)
{
    return <GenericBox name={item.name} image={item.images.length > 0 ? `/data/img/projects/${item.images[0].name}` : undefined} nsfw={item.nsfw} onClick={() => setPreview(`/data/img/projects/${item.images[0].name}`)}
            buttons={item.links.map(x => ({ type: "LinkExternal", label: x.name, link: x.content, labelType: "Text", color: "Default" }))}
        ></GenericBox>
};