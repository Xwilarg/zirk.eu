import projectData from "../data/json/projects.json";
import oldProjectData from "../data/json/projects-old.json";
import { useEffect, useState, type ReactElement } from "react";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ProjectIntroComponent from "./components/intro/ProjectIntroComponent";
import ProjectItemForm from "./item/ProjectItemForm";
import { isNsfw, randInt } from "./utils";
import ImageModalForm from "./modal/ImageModalForm";

export default function ProjectForm() {
    const [projectHtml, setProjectHtml] = useState<ReactElement[]>([]);
    const [showOldProjects, setShowOldProjects] = useState(false);
    const [oldProjectHtml, setOldProjectHtml] = useState<ReactElement[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [preview, setPreview] = useState<string | null>(null);

    let nsfwStatus = isNsfw();

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let p of projectData)
        {
            if (nsfwStatus !== "FullSFW" || !p.nsfw) data.push(<ProjectItemForm key={p.name} p={p} setPreview={setPreview} />)
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
                data.push(<ProjectItemForm key={elem.name} p={elem} setPreview={setPreview} />)
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
            <div className="is-flex flex-center-hor" id="project-list">
                { projectHtml }
            </div>
            <button className="container box" onClick={_ => setShowOldProjects(x => !x)} id="project-btn-old">See old projects</button>
            {
                showOldProjects ?
                <>
                    <button className="button" onClick={_ => setRefresh(x => x + 1)}>Refresh</button>
                    <div className="is-flex flex-center-hor">
                        { oldProjectHtml }
                    </div>
                </>
                : <></>
            }
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}