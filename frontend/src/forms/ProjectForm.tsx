import QuoteComponent from "../components/QuoteComponent";
import NavbarComponent from "../components/NavbarComponent";
import type { ProjectCommitsItem, ProjectItem } from "../models/api/Project";
import ProjectBox from "../boxes/impl/ProjectBox";
import ImageModalForm from "../components/modal/ImageModalForm";
import { useEffect, useState } from "react";
import { useApi } from "../api/useApi";
import { isNsfwNumber } from "../utils";

export default function ProjectForm() {
    const api = useApi();
    const nsfwNb = isNsfwNumber();

    const [preview, setPreview] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [commits, setCommits] = useState<{ [name: string]: ProjectCommitsItem }>({});

    useEffect(() => {
        api.getProjects(nsfwNb).then(x => {
            setProjects(x);
            api.getProjectsCommits(nsfwNb).then(y => setCommits(y));
        });
    }, [])

    return (
        <>
            <QuoteComponent />
            <NavbarComponent />
            <div className="is-flex flex-center-hor">
                {
                    projects.map((x: ProjectItem) => <ProjectBox key={x.name} item={x} setPreview={setPreview} commits={x.name in commits ? commits[x.name] : null} />)
                }
            </div>
            {
                preview !== null ?
                <ImageModalForm image={preview} unsetImage={setPreview} />
                : <></>
            }
        </>
    )
}