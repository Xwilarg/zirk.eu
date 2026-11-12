import GenericBox from "../GenericBox";
import type { ProjectCommitsItem, ProjectItem } from "../../models/api/Project";
import type { IconInfo } from "../../models/IconInfo";

interface ProjectItemFormProps
{
    item: ProjectItem
    commits: ProjectCommitsItem | null
    folder: string
    setPreview: (image: string) => void
}

export default function ProjectBox({ item, setPreview, folder, commits }: ProjectItemFormProps)
{
    let highlight: IconInfo | undefined = undefined;
    if (commits && commits.lastCommitMessage !== null)
        highlight = { icon: "update", alt: commits.lastCommitMessage, label: new Date(commits.lastCommitDate).toISOString().slice(0, 10) };
    else if (item.metadata?.end) {
        highlight = { icon: "update", label: item.metadata.end };
    }

    return <GenericBox name={item.name} subtitle={item.description} nsfw={item.nsfw}
    image={item.images.length > 0 ? `/data/img/${folder}/${item.images[0].name}` : undefined}
    onClick={() => setPreview(`/data/img/${folder}/${item.images[0].name}`)}
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
            highlight={highlight}
        ></GenericBox>
};