import { useState } from "react";
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";

export default function GoalForm() {
    const [preview, setPreview] = useState<string | null>(null);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <GenericBox name="Travel" nsfw={false} custom={
            <table className="table-2col goal-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><h4 className="text-center">Japan</h4><div className="card-img goal-main-img is-flex flex-center-hor"><img className="clickable" src="/data/img/boxes/Japan.jpg" onClick={() => setPreview("/data/img/boxes/Japan.jpg")} /></div></td>
                        <td><h4 className="text-center">Taiwan</h4><div className="card-img goal-main-img is-flex flex-center-hor"><img className="clickable" src="/data/img/boxes/Taiwan.jpg" onClick={() => setPreview("/data/img/boxes/Taiwan.jpg")} /></div></td>
                    </tr>
                    <tr>
                        <td><h4 className="text-center">Costa Rica</h4><div className="card-img goal-main-img is-flex flex-center-hor"></div></td>
                        <td><h4 className="text-center">Chile</h4><div className="card-img goal-main-img is-flex flex-center-hor"></div></td>
                    </tr>
                </tbody>
            </table>
            } />
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}