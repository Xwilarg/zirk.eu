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
            buttons={item.links.map(x => {
                let label;
                switch (x.type)
                {
                    case "SourceCode": label = "github.svg"; break;
                    case "Website": label = "language"; break;
                    case "Demo": label = "language"; break;
                    case "Discord": label = "discord.svg"; break;
                    case "Stoat": label = "stoat.svg"; break;
                    case "Documentation": label = "code"; break;
                    default: label = ""; break;
                }
                return (
                { 
                    type: "LinkExternal",
                    link: x.content,
                    label: label,
                    labelType: [ "SourceCode", "Discord", "Stoat" ].includes(x.type) ? "LocalIcon" : "GoogleIcon",
                    color: "Default"
                })
            })}
            highlight={commits ? { icon: "update", alt: "Last update", label: new Date(commits.lastCommitDate).toISOString().slice(0, 10) } : undefined}
        ></GenericBox>
};