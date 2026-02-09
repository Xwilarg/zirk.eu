import { forwardRef } from "react";

interface ProjectItemFormProps
{
    p: any
}

const ProjectItemForm = forwardRef((
    { p }: ProjectItemFormProps,
    _
) => {
    return <div className="big-card" key={p.name}>
        <h2>{p.name}</h2>
        <small>{p.description}</small>
        <div className="project-img">
            {
                p.images ?
                    <img src={`/data/img/projects/${p.images[0].name}`} /> :
                    <img className={p.nsfw ? "blur" : ""} src={`/data/old/projects-old/${p.image.name}.png`} />
            }
        </div>
        <div className="project-buttons is-flex">
            {
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