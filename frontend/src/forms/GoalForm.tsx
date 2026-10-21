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
                            Object.entries(content).map(([title, data]) => 
                                {
                                    if (!data) {
                                        return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} />;
                                    }
                                    if (data.image) {
                                        return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} image={data.image} onClick={() => setPreview(data.image)} />
                                    }
                                    if (data.youtube) {
                                        return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} custom={
                                            <iframe width="100%" height="95%"
                                                src={`https://www.youtube-nocookie.com/embed/${data.youtube}?showInfo=0`}
                                                frameborder="0" allow="picture-in-picture; web-share" allowfullscreen></iframe>
                                        } />
                                    }
                                    if (data.images) {
                                        return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} custom={<>
                                            <table className="table-2col">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[0]} /></div></td>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[1]} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[2]} /></div></td>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[3]} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[4]} /></div></td>
                                                        <td><div className={`card-img goal-main-img is-flex flex-center-hor`}><img src={data.images[5]} /></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </>} />
                                    }
                                    return <GenericBox key={title} name={toTitleCase(title)} nsfw={false} />
                                }
                            )
                        }
                    </div>
                </span>
            )
            : <div className="is-flex flex-center-hor">
                {
                    Object.entries(goalData).map(([category, content]) => {
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
            </div>
        }
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}