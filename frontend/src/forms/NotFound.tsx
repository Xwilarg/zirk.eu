import QuoteComponent from "../components/QuoteComponent";
import GenericBox from "../boxes/GenericBox";
import { useEffect } from "react";
import { UnlockAchievement } from "../models/Achievement";

export default function NotFoundForm() {
    useEffect(() => {
        UnlockAchievement("NOT_FOUND");
    }, []);

    return <div>
        <QuoteComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox nsfw={false} name="Not Found" custom={
                <p>
                    Oops looks like the content you're looking for is in another castle<br/>
                    <br/>
                    Use the button below to go back to the main page
                </p>
            } buttons={[{
                label: "To main",
                type: "LinkInternal",
                color: "Primary",
                labelType: "Text",
                link: "/"
            }]} />
        </div>
    </div>
}