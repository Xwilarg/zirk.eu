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
                            return <GenericBox nsfw={false} name={""} achievementId="CARD_ACHIEVEMENT" />
                        }
                        if (x.type === "html") {
                            return <GenericBox nsfw={false} name={`${x.category} - ${x.id}`} achievementId="CARD_ACHIEVEMENT" text={x.html} />
                        }
                        if (x.type === "image") {
                            return <GenericBox nsfw={false} name={`${x.category} - ${x.id}`} achievementId="CARD_ACHIEVEMENT" image={x.image} />
                        }
                        return <GenericBox nsfw={false} name={`${x.category} - ${x.id}`} achievementId="CARD_ACHIEVEMENT" text="Achievement unlocked, but nothing to see here yet..." />
                    }
                )
            }
        </div>
    </>
}