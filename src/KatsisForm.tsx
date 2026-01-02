import { useEffect, useState } from "react"
import NavigationForm from "./NavigationForm";

interface KatsisProject
{
    isInit: boolean
}

export default function KatsisForm() {
    const [katsisProjects, setKatsisProjects] = useState<KatsisProject | null>(null);

    useEffect(() => {
        fetch('https://intranet.katsis.net/api/')
        .then(resp => { if (resp.ok) return resp.json(); throw new Error(""); })
        .then(json => setKatsisProjects(json))
        .catch(_ => setKatsisProjects({ isInit: false }));
    }, [ ]);

    return <>
        <NavigationForm />
        <p className="container box">
            Page creation in progress<br/>
            Is Katsis API accessible by this website yet: { katsisProjects?.isInit?.toString() }
        </p>
    </>
}