import GenericBox from "../GenericBox";
import type { NewsItem } from "../../models/News";
import { useState } from "react";
import type { Button } from "../../models/Button";
import { UnlockAchievement } from "../../models/Achievement";
import type { ReactFormState } from "react-dom/client";

interface NewsItemFormProps
{
    item: NewsItem,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
}

export default function NewsBox({ item, setPreview }: NewsItemFormProps)
{
    const [showInfo, setShowInfo] = useState(false);

    const buttons: Button[] = [
        {
            type: "Custom",
            label: "info",
            labelType: "GoogleIcon",
            color: "Primary",
            action: () => { setShowInfo(x => {
                if (!x) UnlockAchievement("READ_NEWS");
                return !x;
            }) }
        },
        ...item.links.map(x => ({ type: "LinkExternal" as const, label: x.name, link: x.link, labelType: "Text" as const, color: "Default" as const }))
    ]

    if (item.orientation === "vertical") item.css = item.css ? `${item.css} fit` : "fit";
    if (showInfo) {
        return <GenericBox name={item.title} imageCssModifiers={item.css} text={item.text.map(x => `<p>${x}</p>`).join('')} nsfw={item.nsfw} 
                buttons={buttons}
            ></GenericBox>
    }

    return <GenericBox name={item.title} imageCssModifiers={item.css} image={item.image} nsfw={item.nsfw} onClick={() => setPreview(item.image)}
            buttons={buttons}
        ></GenericBox>
};