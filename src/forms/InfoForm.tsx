import { useRef, useState } from "react";
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";
import LifelineComponent from "../components/LifelineComponent";

export default function InfoForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [showLifelineUpdate, setShowLifelineUpdate] = useState(true);

    const lifelineRef = useRef(null);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Technical specifications" nsfw={false} custom={
                <>
                This website is made with <a href='https://react.dev/' target='_blank'>react</a> (with <a href="https://react.dev/reference/react-dom" target="_blank">react-dom</a> and <a href="https://reactrouter.com/" target="_blank">react-router</a>),
                &nbsp;<a href='https://vite.dev/' target='_blank'>vite</a> and <a href='https://www.typescriptlang.org/' target='_blank'>typescript</a><br/>
                <br/>
                Along with that, it's also using <a href="https://fonts.google.com/specimen/Quantico" target="_blank">Quantico font</a> and <a href="https://fonts.google.com/icons" target="_blank">Material Icons</a><br/>
                An <a href="https://commons.wikimedia.org/wiki/File:Japanese_Hiragana_kyokashotai_WU.svg#Licensing">image from Wikimedia</a> is also used (to which I changed the color)<br/>
                <br/>
                This website went through loot of iterations:<br/>
                <div className="is-flex">
                    <img className="gallery-img clickable" src='/data/img/website/v1.png' onClick={() => setPreview('/data/img/website/v1.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v2.png' onClick={() => setPreview('/data/img/website/v2.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v3.png' onClick={() => setPreview('/data/img/website/v3.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v4.png' onClick={() => setPreview('/data/img/website/v4.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v5.png' onClick={() => setPreview('/data/img/website/v5.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v6.png' onClick={() => setPreview('/data/img/website/v6.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v7.png' onClick={() => setPreview('/data/img/website/v7.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v8.png' onClick={() => setPreview('/data/img/website/v8.png')} />
                    <img className="gallery-img clickable" src='/data/img/website/v9.png' onClick={() => setPreview('/data/img/website/v9.png')} />
                </div>
                <small>Click to enlarge</small><br/>
                <br/>
                Source code is available on <a href='https://github.com/Xwilarg/zirk.eu' target='_blank'>GitHub</a><br/>
                You can also check the source code for the <a href='https://github.com/Xwilarg/zirk.eu-v9' target='_blank'>V9</a>,
                the <a href='https://github.com/Xwilarg/zirk.eu-v8' target='_blank'>V8</a>,
                the <a href='https://github.com/Xwilarg/zirk.eu-v7' target='_blank'>V6/V7</a>,
                the <a href='https://github.com/Xwilarg/zirk.eu-v5' target='_blank'>V5</a> and
                the <a href='https://github.com/Xwilarg/zirk.eu-old' target='_blank'>older versions</a><br/>
                </>
            } buttons={[{
                color: "Default",
                label: "github.svg",
                labelType: "LocalIcon",
                type: "Link",
                link: "https://github.com/Xwilarg/zirk.eu"
            }]} />
            <GenericBox name="Lifeline" nsfw={false} custom={<LifelineComponent ref={lifelineRef} />}
            buttons={showLifelineUpdate ? [{ type: "Custom", action: () => { lifelineRef.current!.update(); setShowLifelineUpdate(false) }, color: "Default", label: "refresh", labelType: "GoogleIcon" }] : []} />
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}