import projectData from "../data/json/projects.json";
import { useEffect, useState, type ReactElement } from "react";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ProjectIntroComponent from "./components/intro/ProjectIntroComponent";

export default function ProjectForm() {
    const [projectHtml, setProjectHtml] = useState<ReactElement[]>([]);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let p of projectData)
        {
            data.push(<div className="big-card" key={p.name}>
                <h2>{p.name}</h2>
                <small>{p.description}</small>
                <div className="project-img is-flex flex-center-hor">
                    <img src={`/data/img/projects/${p.images[0].name}`} />
                </div>
                <div className="gamejam-buttons is-flex">
                    {
                        
                    }
                </div>
            </div>)
        }

        setProjectHtml(data);
    }, []);

    return <>
        <QuoteComponent/>
        <ProjectIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Projects</p>
            <div className="is-flex flex-center-hor">
                { projectHtml }
            </div>
        </div>
    </>
}