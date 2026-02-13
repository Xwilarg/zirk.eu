import { useEffect, useState, type ReactElement } from "react"
import NavigationForm from "./NavigationForm";
import { isNsfw, type NsfwStatus } from "./utils";
import { Link, useSearchParams } from "react-router";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import InfoIntroComponent from "./components/intro/InfoIntroComponent";
import InfoHobbyForm from "./InfoHobbyForm";

interface Question
{
    category: CategoryType,
    question: string,
    answer: ((nsfwStatus: NsfwStatus) => ReactElement)
}

type CategoryType = "website" | "me";

const nsfwQuestions = [
{
    category: "website" as const,
    question: "Toggle mature content",
    answer: (isNsfw: NsfwStatus) => isNsfw === "NSFW"
        ? <p>You are on the mature version of this website, click <Link to='/info?s=1'>here</Link> to switch to the all-ages version</p>
        : <p>You are on the all-ages version of this website, click <Link to='/info?s=0'>here</Link> to switch to the mature version</p>
}];

const sfwQuestions = [
{
    category: "me" as const,
    question: "Contact me",
    answer:
        (_: NsfwStatus) => <p>
            <ul>
                <li>Discord: zirk</li>
                <li>Mail: <a href="mailto:contact@zirk.eu" target="_blank">contact@zirk.eu</a></li>
            </ul>
        </p>
}, {
    category: "website" as const,
    question: "Technical specifications",
    answer:
        (_: NsfwStatus) => <p>
            This website is made with <a href='https://react.dev/' target='_blank'>react</a>,&nbsp;
            <a href='https://vite.dev/' target='_blank'>vite</a> and&nbsp;
            <a href='https://www.typescriptlang.org/' target='_blank'>typescript</a><br/>
            For the CSS, not library is used, everything is typed with my little hands<br/>
            <br/>
            <a href='/data/img/website/v1.png' target='_blank'>This</a>&nbsp;
            <a href='/data/img/website/v2.png' target='_blank'>website</a>&nbsp;
            <a href='/data/img/website/v3.png' target='_blank'>has</a>&nbsp;
            <a href='/data/img/website/v4.png' target='_blank'>been</a>&nbsp;
            <a href='/data/img/website/v5.png' target='_blank'>redone</a>&nbsp;
            <a href='/data/img/website/v6.png' target='_blank'>too</a>&nbsp;
            <a href='/data/img/website/v7.png' target='_blank'>many</a>&nbsp;
            <a href='/data/img/website/v8.png' target='_blank'>times</a><br/>
            But this time for once I am pretty happy of its architecture so hopefully it'll last!<br/>
            <br/>
            Source code is available on <a href='https://github.com/Xwilarg/zirk.eu' target='_blank'>GitHub</a><br/>
            You can also check the source code for the <a href='https://github.com/Xwilarg/zirk.eu-v8' target='_blank'>V8</a>,
            the <a href='https://github.com/Xwilarg/zirk.eu-v7' target='_blank'>V6/V7</a>,
            the <a href='https://github.com/Xwilarg/zirk.eu-v5' target='_blank'>V5</a> and
            the <a href='https://github.com/Xwilarg/zirk.eu-old' target='_blank'>older versions</a>
        </p>
},
{
    category: "website" as const,
    question: "Information collected",
    answer:
        (_: NsfwStatus) => <p>
            This website is using <a href='https://github.com/Astylodon/Shika' target='_blank'>Shika</a> for its analytics<br/>
            You can see all the data collected <a href='https://astylodon.org/docs/shika/data' target='_blank'>here</a>
        </p>
},
{
    category: "website" as const,
    question: "Known bugs",
    answer:
        (_: NsfwStatus) => <p>
            <ul>
                <li>Loading a GD Studio game, loading another one then loading the 1st one again throw an error and fail to load it</li>
                <li>Closing a Unity game (version 2018 or under) or GB Studio doesn't close the context properly</li>
                <li>WebGL games made with Unreal Engine, Godot and specific Unity projects aren't supported in WebGL preview</li>
                <li>Closing a Untiy game mid-loading will break the context</li>
            </ul>
        </p>
},
{
    category: "me" as const,
    question: "Steam replay",
    answer:
        (_: NsfwStatus) => <p className='is-flex flex-center-hor' id='steam-replay'>
            <img src='/data/img/steam/2025.png' />
            <img src='/data/img/steam/2024.png' />
            <img src='/data/img/steam/2023.png' />
            <img src='/data/img/steam/2022.png' />
        </p>
},
{
    category: "me" as const,
    question: "Hobbies",
    answer:
        (_: NsfwStatus) => <p>
            <InfoHobbyForm />
        </p>
},
{
    category: "me" as const,
    question: "More about me",
    answer:
        (p: NsfwStatus) => <span>
            <p>
                <h3>History</h3>
                I was bornt a bit before 2000 in Essone, France and during my school years quickly became interested with video game development<br/>
                <br/>
                I first picked C and C++ thanks to the <a href="https://en.wikipedia.org/wiki/OpenClassrooms" target="_blank">Site du Zéro</a> and quickly jumped into Ti-Basic to make my amazing first game on calculator:<br/><a href="/data/old/projects-old/TQOZ.png" target="_blank">The Quest of Zirk</a><br/>
                <br/>
                Once I joined high-school, I went into scientific section and took <abbr title="Informatic and Digital Sciences">ISN</abbr> as specialization to produce <a href="/data/old/projects-old/ProjetISNProcessing.png" target="_blank">an unnamed video game project</a> in Java for my bachelor<br/>
                <br/>
                I wasn't especially studious and spent <small>way too much</small> time, playing (mainly) Team Fortress 2, but hey, I won <a href="https://steamcommunity.com/id/xwilarg/inventory#440_2_3691674641" target="_blank">TF2Connexion division 4 as a sub-scout</a> so yay :D<br/>
                <br/>
                Outside of games, my main hobby have been anime and manga after introduced me to <a href="https://anilist.co/anime/8424/MM" target="_blank">MM!</a> which in retrospective was decent but not amazing, but the opening and ending are very catchy<br/>
                I don't watch much of them anymore these days but this led me to my interest in Japan in general, being the music, the food, the arcade games, and eventually the language itself (which I am still slowly learning)<br/>
                <br/>
                I then continued my higher education, learning more programming languages around the way and in my first year doing my <a href="https://web.archive.org/web/20210227130840/http://ludumdare.com/compo/ludum-dare-37/?action=preview&uid=123799" target="_blank">first gamejam</a><br/>
                Along others projects I also started <a href="https://sanara.zirk.eu/" target="_blank">Sanara</a>, a Discord bot that I still <small>slightly</small> maintains today<br/>
                Out of weird trivia, during one of my internship at the french ground forces, I also got baptized by the <a href="/data/img/about/forgeron.png" target="_blank">saint brotherhood of blacksmiths</a> <small>I know if sounds like some weird cult thing but it's not</small><br/>
                <br/>
                Once out of school, I joined a few companies but never stayed too long and continued to do a looot of gamejams until that fateful moment where I participated to&nbsp;
                {
                    p == "NSFW"
                    ? <span><a href="https://itch.io/jam/lewdie-jam-2023/rate/2388230" target="_blank">the Lewdie Jam</a></span>
                    : <span>one of them</span>
                }
                &nbsp;which led me in co-creating <span className="katsis-highlight">Katsis</span> with Fractal<br/>
            </p>
            <p>
                <h3>Today</h3>
                My main occupation today is first <span className="katsis-highlight">Katsis</span>, outside of that I still love programming, jumping on a lot of gamejams <small>(sorry Fractal)</small> and maintaining projects, either alone or as part of <a href="https://astylodon.org/" target="_blank">Astylodon</a><br/>
                <br/>
                There are however still plenty of things I still like to do outside of programming, overall my personality is very squared and I like well defined rules and love learning about things that follow them (stuff like trains, geopolitical entities, particle physics, etc...)<br/>
                I also love new experiences like new foodstuff, places, etc... and overall negative experiences don't really affect much<br/>
                Along with that I'm also trying to learn more creative skills like drawing and writing, but also learning new languages (mainly Japanese for now but hoping to extends that to Spanish and mandarin Chinese someday)<br/>
                <br/>
                I'm quite introverted and suck at fueling conversations so if things feels a bit awkward please note that it's not necessarly that I dislike you or so, and if you're annoyed with me because of something don't hesitate to tell me so we can sort it out :)<br/>
                There are probably more I can say about my personality but it feels a bit embarassing to write everything here so boom end of intro
            </p>
            {
                p == "NSFW" ?
                <p>
                    <h3>Sexuality</h3>
                    Wow you turned the NSFW of this website on so I guess I should expend on this part a bit<br/>
                    About my sexuality I am <a href="https://en.pronouns.page/terminology?filter=demisexual" target="_blank">demisexual</a> (<small>and very submissive</small>)<br/>
                    <br/>
                    As mentionned above, my main occupation is working as part of <span className="katsis-highlight">Katsis</span>, I love NSFW content being expressed through a story and characters surrounded by goals, things they like, etc... <small>and then being fucked</small><br/>
                    <br/>
                    My main fetichisms are monsters, futanari, hyper and inflation, and I love seeing them on females and males equally <small>(Fractal we need more male characters being fucked within <span className="katsis-highlight">Katsis</span>)</small>
                </p>
                : <></>
            }
        </span>
}];

export default function InfoForm() {
    const [questions, setQuestions] = useState<Question[]>(isNsfw() === "FullSFW" ? sfwQuestions : [...sfwQuestions, ...nsfwQuestions]);
    const [questionsElements, setQuestionsElements] = useState<Record<CategoryType, ReactElement[]>>({
        "website": [],
        "me": []
    });
    const [openedQuestion, setOpenedQuestion] = useState(-1);
    const [searchParams] = useSearchParams();

    const nsfwStatus = isNsfw();
    useEffect(() => {
        let data: Record<CategoryType, ReactElement[]> = {
            "website": [],
            "me": []
        };

        for (let i = 0; i < questions.length; i++)
        {
            data[questions[i].category].push(
                <button data-category={questions[i].category} key={questions[i].question} className="container box" onClick={_ => setOpenedQuestion(x => x === i ? -1 : i)}>{questions[i].question}</button>
            );
            if (openedQuestion === i)
            {
                data[questions[i].category].push(
                    questions[i].answer(nsfwStatus)
                );
            }
        }

        setQuestionsElements(data);
    }, [ questions, openedQuestion, searchParams ])

    return <>
        <QuoteComponent />
        <InfoIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Information</p>
            <div className="container">
                <h2>About this website</h2>
                { questionsElements["website"] }
            </div> 
            <div className="container">
                <h2>About me</h2>
                { questionsElements["me"] }
            </div>
        </div>
    </>
}