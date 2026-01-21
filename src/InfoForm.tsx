import { useEffect, useState, type ReactElement } from "react"
import NavigationForm from "./NavigationForm";
import { isNsfw, type NsfwStatus } from "./utils";
import { Link, useSearchParams } from "react-router";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import InfoIntroComponent from "./components/intro/InfoIntroComponent";

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
        (_: NsfwStatus) => <p className='container is-flex flex-center-hor' id='steam-replay'>
            <img src='/data/img/steam/2025.png' />
            <img src='/data/img/steam/2024.png' />
            <img src='/data/img/steam/2023.png' />
            <img src='/data/img/steam/2022.png' />
        </p>
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