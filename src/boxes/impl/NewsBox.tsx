import GenericBox from "../GenericBox";
import type { NewsItem } from "../../models/News";
import { useState } from "react";
import type { Button } from "../../models/Button";

interface NewsItemFormProps
{
    item: NewsItem
}

export default function NewsBox({ item }: NewsItemFormProps)
{
    const [showInfo, setShowInfo] = useState(false);

    const buttons: Button[] = [
        {
            type: "Custom",
            label: "info",
            labelType: "GoogleIcon",
            color: "Primary",
            action: () => { setShowInfo(x => !x) }
        },
        ...item.links.map(x => ({ type: "Link" as const, label: x.name, link: x.link, labelType: "Text" as const, color: "Default" as const }))
    ]

    if (showInfo) {
        return <GenericBox name={item.title} imageCssModifiers="css" text={item.text.join("<br/><br/>")} nsfw={item.nsfw}
                buttons={buttons}
            ></GenericBox>
    }

    return <GenericBox name={item.title} imageCssModifiers={item.css} image={item.image} nsfw={item.nsfw}
            buttons={buttons}
        ></GenericBox>
};