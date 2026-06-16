import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import fractalData from "../data/json/fractal.json";
import FractalIntroComponent from "./components/intro/FractalIntroComponent";
import { useState } from "react";
import ImageModalForm from "./modal/ImageModalForm";

export default function FractalForm() {
    const [preview, setPreview] = useState<string | null>(null);

    return <>
        <QuoteComponent/>
        <FractalIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Fractal</p>
            <table id="fractal-table">
                <thead>
                    <tr>
                        <th></th>
                        {fractalData.map(x => <th>{x.name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Fractal</th>
                        {fractalData.map(x => x.forms.map(y => y.fractal ? <td><img className="clickable" onClick={() => { setPreview(`/data/img/ocs/${y.fractal.oc}/${y.fractal.filename}`) }} src={`/data/previews/ocs/${y.fractal.oc}/${y.fractal.filename}`} /></td> : <td></td>))}
                    </tr>
                    <tr>
                        <th>Beast</th>
                        {fractalData.map(x => x.forms.map(y => y.beast ? <td><img className="clickable" onClick={() => { setPreview(`/data/img/ocs/${y.beast.oc}/${y.beast.filename}`) }} src={`/data/previews/ocs/${y.beast.oc}/${y.beast.filename}`} /></td> : <td></td>))}
                    </tr>
                    <tr>
                        <th>Human</th>
                        {fractalData.map(x => x.forms.map(y => y.human ? <td><img className="clickable" onClick={() => { setPreview(`/data/img/ocs/${y.human.oc}/${y.human.filename}`) }} src={`/data/previews/ocs/${y.human.oc}/${y.human.filename}`} /></td> : <td></td>))}
                    </tr>
                </tbody>
            </table>
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}