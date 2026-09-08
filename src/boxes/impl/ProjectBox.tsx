import GenericBox from "../GenericBox";
import type { ProjectItem } from "../../models/Project";

interface ProjectItemFormProps
{
    item: ProjectItem
    setPreview: (image: string) => void
}

export default function ProjectBox({ item, setPreview }: ProjectItemFormProps)
{
    return <GenericBox name={item.name} image={`/data/img/projects/${item.images[0].name}`} nsfw={item.nsfw} onClick={() => setPreview(`/data/img/projects/${item.images[0].name}`)}
            buttons={item.links.map(x => ({ type: "Link", label: x.name, link: x.content, labelType: "Text", color: "Default" }))}
        ></GenericBox>
};