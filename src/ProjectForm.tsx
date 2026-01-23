import NavigationForm from "./NavigationForm";
import projectData from "../data/json/projects.json";
import { useState } from "react";

export default function ProjectForm() {
    const [projects, setProjects] = useState(projectData)

    return <>
        <NavigationForm />
        <p className="container box">
        </p>
    </>
}