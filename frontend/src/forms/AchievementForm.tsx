import { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";

import GenericBox from "../boxes/GenericBox";
import type { AchievementItem } from "../models/Achievement";
import { useApi } from "../api/useApi";

export default function AchievementForm() {
    const api = useApi();

    const [achievements, setAchievements] = useState<AchievementItem[]>([]);

    useEffect(() => {
        api.getAchievementInfo(JSON.parse(localStorage.getItem("achievements") ?? "[]")).then(x => setAchievements(x));
    }, []);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            {
                achievements.map(x =>
                    {
                        if (x === null) {
                            return <GenericBox nsfw={false} name={""} />
                        }
                        if (x.type === "html") {
                            return <GenericBox nsfw={false} name={`${x.name}`} text={x.html} />
                        }
                        if (x.type === "image") {
                            return <GenericBox nsfw={false} name={`${x.name}`} image={x.image} />
                        }
                        if (x.type === "image-pixel") {
                            return <GenericBox nsfw={false} name={`${x.name}`} image={x.image} imageCssModifiers="pixel" />
                        }
                        return <GenericBox nsfw={false} name={`${x.id}`} text="Achievement unlocked, but nothing to see here yet..." />
                    }
                )
            }
        </div>
    </>
}