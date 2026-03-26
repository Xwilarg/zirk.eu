import StoryIntroComponent from "./components/intro/StoryIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import storyData from "../data/json/stories.json";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";

export default function StoryForm() {
    const [storyHtml, setStoryHtml] = useState<ReactElement[]>([]);
    const [display, setDisplay] = useState<string>("");

    const nsfwStatus = isNsfw();

    useEffect(() => {
        let data: Array<ReactElement> = [];

        for (let e of storyData)
        {
            if (nsfwStatus !== "NSFW" && e.nsfw) continue;

            for (let c = 0; c < e.chapters.length; c++)
            {
                data.push(<button key={e.name} onClick={ () => {
                    fetch(`/data/stories/${e.chapters[c]}`)
                    .then(x => x.text())
                    .then(t => {
                        if (e.cw.length > 0)
                        {
                            t = `Content warnings: ${e.cw.join(", ")}\n\n${t}`
                        }
                        setDisplay(t);
                    });
                }
                }>
                    { e.name } (Chapter {c})
                </button>);
            }
        }

        setStoryHtml(data);
    }, []);

    return <>
        <QuoteComponent/>
        <StoryIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <div className="is-flex flex-center-hor">
                { storyHtml }
            </div>
            <textarea readOnly={true} className="readonly" id="story-display" value={display}>
            </textarea>
        </div>
    </>
}