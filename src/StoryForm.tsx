import StoryIntroComponent from "./components/intro/StoryIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import storyData from "../data/json/stories.json";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";
import { useSearchParams } from "react-router";

export default function StoryForm() {
    const [storyHtml, setStoryHtml] = useState<ReactElement[]>([]);
    const [display, setDisplay] = useState<string>("");
    const [story, setStory] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const nsfwStatus = isNsfw();

    useEffect(() => {
        const share = searchParams.get("share");
        if (share)
        {
            setStory(share);
        }
    }, []);

    useEffect(() => {
        let data: Array<ReactElement> = [];

        let targetedStory = story === null ? null : storyData.find(x => x.id == story);

        if (!targetedStory)
        {
            for (let e of storyData)
            {
                if (nsfwStatus !== "NSFW" && e.nsfw) continue;

                data.push(<button key={`story-${e.id}`} onClick={ () => {
                    setStory(e.id);
                    setSearchParams(sp => {
                        sp.set("share", e.id);
                        return sp;
                    });
                }
                }>
                    { e.name }
                </button>);
            }
            setDisplay("");
        }
        else
        {
            if (nsfwStatus !== "NSFW" && targetedStory.nsfw)
            {
                setStory(null);
                setSearchParams(sp => {
                    sp.delete("share")
                    return sp;
                });
                return;
            }

            let display = targetedStory.name;
            if (targetedStory.cw.length > 0)
            {
                display += `\nContent warnings: ${targetedStory.cw.join(", ")}`;
            }
            setDisplay(display);

            data.push(<button onClick={() => {
                setStory(null);
                setSearchParams(sp => {
                    sp.delete("share")
                    return sp;
                });
            }}>
                Back
            </button>)
            for (let c = 0; c < targetedStory.chapters.length; c++)
            {
                data.push(<button key={`story-${targetedStory.id}-c-${c}`} onClick={ () => {
                    fetch(`/data/stories/${targetedStory.chapters[c].file}`)
                        .then(x => x.text())
                        .then(t => setDisplay(t));
                }
                } dangerouslySetInnerHTML={{ __html: `<b>Chapter ${c}:</b> ${targetedStory.chapters[c].title}` }}>
                </button>);
            }
        }

        setStoryHtml(data);
    }, [ story ]);

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