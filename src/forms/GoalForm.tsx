import { useState, type JSX } from "react";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";
import goalData from "../../data/json/goal.json"
import GenericBox from "../boxes/GenericBox";
import { toTitleCase } from "../utils";

type Goal = keyof typeof goalData;

export default function GoalForm() {
    const [filter, setFilter] = useState<Goal | null>(null);
    const [preview, setPreview] = useState<string | null>(null);


    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <button onClick={() => { setFilter(null) }}>Overview</button>
            {
                Object.keys(goalData).map(x => <button key={x} onClick={() => { setFilter(x as Goal) }}>{toTitleCase(x)}</button>)
            }
        </div>
        <br />
        {
            filter ? Object.entries(goalData[filter].data).map(([category, content]) => 
                <span key={category}>
                    <div className="is-flex flex-center-hor">
                        <h4>{toTitleCase(category)}</h4>
                    </div>
                    <div className="is-flex flex-center-hor">
                        {
                            Object.entries(content).map(([title, images]) => 
                                {
                                    if (typeof images === "string") {
                                        return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} image={images} />
                                    }
                                    return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} />
                                }
                            )
                        }
                    </div>
                </span>
            )
            : Object.entries(goalData).map(([category, content]) => {
                let valid = 0;
                let total = 0;

                for (let subcategory of Object.values(content.data)) {
                    for (let child of Object.values(subcategory))
                    {
                        total++;
                        if (child !== null) valid++;
                    }
                }

                return <GenericBox key={category} name={toTitleCase(category)} nsfw={false} custom={
                    <div className="is-flex flex-center-hor">
                        <h3>{valid} / {total}</h3>
                    </div>
                } buttons={[ { type: "Custom", labelType: "GoogleIcon", label: "info", color: "Primary", action: () => { setFilter(category as Goal) }} ]} />
            })
        }
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}