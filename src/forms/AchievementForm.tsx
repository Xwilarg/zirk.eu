import { useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";

import achievementData from "../../data/json/achievements.json"
import GenericBox from "../boxes/GenericBox";

export default function AchievementForm() {
    const [ unlocked, setUnlocked ] = useState<string[]>(JSON.parse(localStorage.getItem("achievements") ?? "[]"));

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            {
                achievementData.map(x =>
                    {
                        if (!unlocked.includes(x.id)) {
                            return <GenericBox nsfw={false} name={""} />
                        }
                        if (x.type === "html") {
                            return <GenericBox nsfw={false} name={`${x.name}`} text={x.html} />
                        }
                        if (x.type === "image") {
                            return <GenericBox nsfw={false} name={`${x.name}`} image={x.image} />
                        }
                        return <GenericBox nsfw={false} name={`${x.id}`} text="Achievement unlocked, but nothing to see here yet..." />
                    }
                )
            }
        </div>
    </>
}