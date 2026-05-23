import { forwardRef } from "react";
import { isNsfw } from "../utils";

interface ProjectItemFormProps
{
    p: any
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
}

const ProjectItemForm = forwardRef((
    { p, setPreview }: ProjectItemFormProps,
    _
) => {
    const nsfwStatus = isNsfw();
    const shouldBlur = p.nsfw && nsfwStatus === "SFW";

    return <div className="big-card" key={p.name}>
        <h2 className="project-name">{shouldBlur ? "" : p.name}</h2>
        <small className="project-description">{p.description}</small>
        <span className="is-flex flex-center-hor">
            <div className="project-img">
                {
                    p.images ?
                        <img className={shouldBlur ? "blur" : "clickable"} src={`/data/img/projects/${p.images[0].name}`} onClick={e => { if (!shouldBlur) setPreview((e.target as HTMLImageElement).src) }} /> :
                        <img className={shouldBlur ? "blur" : "clickable"} src={`/data/img/projects-old/${p.image.name}.png`} onClick={e => { if (!shouldBlur) setPreview((e.target as HTMLImageElement).src) }} />
                }
            </div>
        </span>
        <div className="project-buttons is-flex">
            {
                shouldBlur ? <></> :
                p.links.map((l: any) => {
                    return <a key={l.content} href={l.content} target="_blank">
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