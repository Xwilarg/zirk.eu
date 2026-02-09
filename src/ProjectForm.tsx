import projectData from "../data/json/projects.json";
import oldProjectData from "../data/json/projects-old.json";
import { useEffect, useState, type ReactElement } from "react";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ProjectIntroComponent from "./components/intro/ProjectIntroComponent";
import ProjectItemForm from "./item/ProjectItemForm";
import { randInt } from "./utils";

export default function ProjectForm() {
    const [projectHtml, setProjectHtml] = useState<ReactElement[]>([]);
    const [oldProjectHtml, setOldProjectHtml] = useState<ReactElement[]>([]);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let p of projectData)
        {
            data.push(<ProjectItemForm key={p.name} p={p} />)
        }

        setProjectHtml(data);
    }, []);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let i = 0; i < 4; i++)
        {
            const elem = oldProjectData[randInt(oldProjectData.length)];
            if (data.some(x => x.key === elem.name))
            {
                i--;
            } else {
                data.push(<ProjectItemForm key={elem.name} p={elem} />)
            }
        }

        setOldProjectHtml(data);
    }, [ refresh ]);

    return <>
        <QuoteComponent/>
        <ProjectIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Projects</p>
            <div className="is-flex flex-center-hor">
                { projectHtml }
            </div>
            <h3>Old projects</h3>
            <button className="button" onClick={_ => setRefresh(x => x + 1)}>Refresh</button>
            <div className="is-flex flex-center-hor">
                { oldProjectHtml }
            </div>
        </div>
    </>
}