import React, { useEffect, useState, type ReactElement } from "react"
import NavigationForm from "./NavigationForm";

interface Question
{
    question: string,
    answer: string
}

export default function InfoForm() {
    const [questions, setQuestions] = useState<Question[]>([
        {
            question: "How was this website made?",
            answer:
                "This website is made with <a href='https://react.dev/' target='_blank'>react</a>, " +
                "<a href='https://vite.dev/' target='_blank'>vite</a> and " +
                "<a href='https://www.typescriptlang.org/' target='_blank'>typescript</a>\n" +
                "For the CSS, not library is used, everything is typed with my little hands\n" +
                "\n" +
                "<a href='/data/img/website/v1.png' target='_blank'>This</a> " +
                "<a href='/data/img/website/v2.png' target='_blank'>website</a> " +
                "<a href='/data/img/website/v3.png' target='_blank'>has</a> " +
                "<a href='/data/img/website/v4.png' target='_blank'>been</a> " +
                "<a href='/data/img/website/v5.png' target='_blank'>redone</a> " +
                "<a href='/data/img/website/v6.png' target='_blank'>too</a> " +
                "<a href='/data/img/website/v7.png' target='_blank'>many</a> " +
                "<a href='/data/img/website/v8.png' target='_blank'>times</a>\n" +
                "But this time for once I am pretty happy of its architecture so hopefully it'll last!\n" +
                "\n" +
                "Source code is available on <a href='https://github.com/Xwilarg/zirk.eu' target='_blank'>GitHub</a>\n" +
                "You can also check the source code for the <a href='https://github.com/Xwilarg/zirk.eu-v8' target='_blank'>V8</a>, " +
                "the <a href='https://github.com/Xwilarg/zirk.eu-v7' target='_blank'>V6/V7</a>, " +
                "the <a href='https://github.com/Xwilarg/zirk.eu-v5' target='_blank'>V5</a> and " +
                "the <a href='https://github.com/Xwilarg/zirk.eu-old' target='_blank'>older versions</a>"

        },
        {
            question: "What information does this website collect?",
            answer:
                "This website is using <a href='https://github.com/Astylodon/Shika' target='_blank'>Shika</a> for its analytics\n" +
                "You can see all the data collected <a href='https://astylodon.org/docs/shika/data' target='_blank'>here</a>"
        },
        {
            question: "How to toggle mature content?",
            answer:
                "Planning to do that better but for now click <a href='/?s=0'> here</a>"
        },
        {
            question: "Known bugs",
            answer:
                "<ul>" +
                "<li> Loading a GD Studio game, loading another one then loading the 1st one again throw an error and fail to load it</li>" +
                "</ul>"
        }
    ]);
    const [questionsElements, setQuestionsElements] = useState<ReactElement[]>([]);
    const [openedQuestion, setOpenedQuestion] = useState(-1);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let i = 0; i < questions.length; i++)
        {
            data.push(
                <button className="container box" onClick={_ => setOpenedQuestion(x => x === i ? -1 : i)}>{questions[i].question}</button>
            );
            if (openedQuestion === i)
            {
                data.push(
                    <p dangerouslySetInnerHTML={{ __html: questions[i].answer.replaceAll("\n", "<br/>") }}></p>
                );
            }
        }

        setQuestionsElements(data);
    }, [ questions, openedQuestion ])

    return <>
        <NavigationForm />
        <div className="container">
            { questionsElements }
        </div> 
    </>
}