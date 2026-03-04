import { forwardRef } from "react";
import { isNsfw } from "../utils";

interface ProjectItemFormProps
{
    p: any
}

const ProjectItemForm = forwardRef((
    { p }: ProjectItemFormProps,
    _
) => {
    const nsfwStatus = isNsfw();

    return <div className="big-card" key={p.name}>
        <h2 className="project-name">{(p.nsfw && (nsfwStatus === "SFW" || nsfwStatus === "FullSFW")) ? "" : p.name}</h2>
        <small>{p.description}</small>
        <div className="project-img">
            {
                p.images ?
                    <img className={p.nsfw && (nsfwStatus === "SFW" || nsfwStatus === "FullSFW") ? "blur" : ""} src={`/data/img/projects/${p.images[0].name}`} /> :
                    <img className={p.nsfw && nsfwStatus === "SFW" ? "blur" : ""} src={`/data/old/projects-old/${p.image.name}.png`} />
            }
        </div>
        <div className="project-buttons is-flex">
            {
                p.nsfw && nsfwStatus === "SFW" ? <></> :
                p.links.map((l: any) => {
                    return <a href={l.content} target="_blank">
                        <button className="button">
                            { l.name }
                        </button>
                    </a>
                })
            }
        </div>
    </div>
});

export default ProjectItemForm;