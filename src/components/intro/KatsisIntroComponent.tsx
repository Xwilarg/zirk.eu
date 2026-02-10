import { useEffect, useState } from "react";

interface KatsisProject
{
    isInit: boolean
}

export default function KatsisIntroComponent() {
    const [katsisProjects, setKatsisProjects] = useState<KatsisProject | null>(null);

    useEffect(() => {
        fetch('https://intranet.katsis.net/api/')
        .then(resp => { if (resp.ok) return resp.json(); throw new Error(""); })
        .then(json => setKatsisProjects(json))
        .catch(_ => setKatsisProjects({ isInit: false }));
    }, [ ]);

    return <div className="container box">
        <p className="mark">Introduction</p>
        <div id="intro">
            Sadly someone <small>(me)</small> didn't implements CORS properly for the intranet<br/>
            Now the intranet is being refactored so this page can't show much until it's done...<br/>
            Is Katsis API accessible by this website yet: { katsisProjects?.isInit ? "yes" : "no" }
        </div>
    </div>
}
