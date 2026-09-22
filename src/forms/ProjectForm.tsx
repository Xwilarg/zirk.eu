import projectData from "../../data/json/projects.json"
import QuoteComponent from "../components/QuoteComponent";
import NavbarComponent from "../components/NavbarComponent";
import type { ProjectItem } from "../models/Project";
import ProjectBox from "../boxes/impl/ProjectBox";
import ImageModalForm from "../components/modal/ImageModalForm";
import { useState } from "react";

export default function ProjectForm() {
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <>
            <QuoteComponent />
            <NavbarComponent />
            <div className="is-flex flex-center-hor">
                {
                    projectData
                        .map((x: ProjectItem) => <ProjectBox key={x.name} item={x} setPreview={setPreview} />)
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