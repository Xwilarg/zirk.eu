import { useRef, useState } from "react";
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";
import ImageModalForm from "../components/modal/ImageModalForm";
import LifelineComponent from "../components/LifelineComponent";
import { isNsfw } from "../utils";

export default function InfoForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [showLifelineUpdate, setShowLifelineUpdate] = useState(true);
    const [aboutMeTab, setAboutMeTab] = useState(1);

    const lifelineRef = useRef(null);

    const nsfw = isNsfw();

    let aboutMe = <></>;
    if (aboutMeTab === 0) {
        aboutMe = <>
            <h3>History</h3>
            I was bornt in 1998 in Essone, France and during my school years quickly became interested first with video games<br/>
            Following that, I then became interested by game development, first picking C and C++ thanks to the <a href="https://en.wikipedia.org/wiki/OpenClassrooms" target="_blank">Site du Zéro</a> and quickly jumped into Ti-Basic to make my amazing first game on calculator:<br/><a href="/data/img/projects-old/TQOZ.png" target="_blank">The Quest of Zirk</a><br/>
            <br/>
            Once I joined high-school, I went into scientific section and took <abbr title="Informatic and Digital Sciences">ISN</abbr> as specialization to produce <a href="/data/img/projects-old/ProjetISNProcessing.png" target="_blank">an unnamed video game project</a> in Java for my bachelor<br/>
            <br/>
            I wasn't especially studious and spent <small>way too much</small> time, playing (mainly) Team Fortress 2, but hey, I won <a href="https://steamcommunity.com/id/xwilarg/inventory#440_2_3691674641" target="_blank">TF2Connexion season 14 division 4 (as a sub-scout)</a> so yay :D<br/>
            <br/>
            Back then my main hobby outside of games had been anime and manga after someone introduced me to <a href="https://anilist.co/anime/8424/MM" target="_blank">MM!</a> which in retrospective was decent but not amazing, but <a href="https://www.youtube.com/watch?v=ZJgMHGRwPx0" target="_blank">the opening and ending were very catchy</a><br/>
            I don't watch much of them anymore these days but this led me to my interest in Japan in general, being the music, the food, the arcade games, and eventually the language itself (which I am still slowly learning)<br/>
            <br/>
            I then continued my higher education, deepening my programming knowledge around the way and in my first year doing my <a href="https://web.archive.org/web/20210227130840/http://ludumdare.com/compo/ludum-dare-37/?action=preview&uid=123799" target="_blank">first gamejam</a><br/>
            During my first internship I also started my first big project, <a href="https://sanara.zirk.eu/" target="_blank">Sanara</a>, a Discord bot that I still <small>slightly</small> maintains today<br/>
            Out of weird trivia, during one of my internship at the french ground forces, I also got baptized by the <a href="/data/img/about/forgeron.png" target="_blank">saint brotherhood of blacksmiths</a> <small>I know if sounds like some weird cult thing but it's not</small><br/>
            <br/>
            Once out of school, I joined a few companies but never stayed too long and continued to do a looot of gamejams until that fateful moment where I participated to&nbsp;
            {
                nsfw == "NSFW"
                ? <span><a href="https://itch.io/jam/lewdie-jam-2023/rate/2388230" target="_blank">the Lewdie Jam</a></span>
                : <span>one of them</span>
            }
            &nbsp;which led me in co-creating <span className="katsis-highlight">Katsis</span> with Fractal<br/>
        </>
    }
    else if (aboutMeTab === 1) {
        aboutMe = <>
            <h3>Today</h3>
            My main occupation today is first <span className="katsis-highlight">Katsis</span>, outside of that I still love programming, jumping on a lot of gamejams <small>(sorry Fractal)</small> and maintaining projects<br/>
            <br/>
        </>
    }

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Technical specifications" nsfw={false} custom={
                <>
                This website is using <a href='https://github.com/Astylodon/Shika' target='_blank'>Shika</a> for its analytics<br/>
                You can see all the data collected <a href='https://astylodon.org/docs/shika/data' target='_blank'>here</a><br/>
                <br/>
                It is made with <a href='https://react.dev/' target='_blank'>react</a> (with <a href="https://react.dev/reference/react-dom" target="_blank">react-dom</a> and <a href="https://reactrouter.com/" target="_blank">react-router</a>),
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
                buttons={showLifelineUpdate ? [{
                type: "Custom",
                action: () => { (lifelineRef.current! as any).update(); setShowLifelineUpdate(false) },
                color: "Default",
                label: "refresh",
                labelType: "GoogleIcon" }] : []}
            />
            <GenericBox name="Steam Replay" nsfw={false} custom={
                <div className="is-flex flex-center-hor">
                    <img className="clickable card-img" src="/data/img/steam/2025.png" onClick={() => setPreview("/data/img/steam/2025.png")} />
                    <img className="clickable card-img" src="/data/img/steam/2024.png" onClick={() => setPreview("/data/img/steam/2024.png")} />
                    <img className="clickable card-img" src="/data/img/steam/2023.png" onClick={() => setPreview("/data/img/steam/2023.png")} />
                </div>}
            />
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
    /*
            <GenericBox name="More about me" nsfw={false} custom={aboutMe} buttons={[
                { type: "Custom", action: () => { setAboutMeTab(0) }, color: aboutMeTab === 0 ? "Primary" : "Default", label: "History", labelType: "Text" },
                { type: "Custom", action: () => { setAboutMeTab(1) }, color: aboutMeTab === 1 ? "Primary" : "Default", label: "Today", labelType: "Text" }
            ]} />*/
}