import { type ReactElement } from "react";
import type { Button } from "../models/Button";
import { getNavigationNoHook, isNsfw } from "../utils";
import { Link, useSearchParams } from "react-router";
import type { IconInfo } from "../models/IconInfo";

interface GenericBoxProps
{
    name: string // On top of the box

    // Only one of these elements at the same time
    text?: string // Raw HTML
    image?: string | null
    icons?: IconInfo[] // Set of icons (8 preferably)
    custom?: ReactElement

    highlight?: IconInfo, // If set, shown on the right of buttons

    nsfw: boolean // Blur image, hide names and buttons

    imageCssModifiers?: string // CSS modifier added to the image
    className?: string // Global CSS modifier to the whole box

    buttons?: Button[] // Buttons shown at the bottom

    onClick?: React.MouseEventHandler<HTMLImageElement> | undefined
    onMouseEnter?: React.MouseEventHandler<HTMLImageElement> | undefined
    onMouseLeave?: React.MouseEventHandler<HTMLImageElement> | undefined
}

export default function GenericBox({ name, text, image, icons, custom, nsfw, buttons, imageCssModifiers, onClick, onMouseEnter, onMouseLeave, className, highlight } : GenericBoxProps) {
    let nsfwStatus = isNsfw();
    let hideNsfw = nsfw && nsfwStatus !== "NSFW";

    const [ searchParams ] = useSearchParams();

    let btnHtml: ReactElement[] = [];
    if (buttons)
    {
        for (const b of buttons)
        {
            let label = <></>
            if (b.labelType === "GoogleIcon") label = <span className="material-symbols-outlined">{b.label}</span>;
            else if (b.labelType === "LocalIcon") label = <img width={24} height={24} src={`/img/icon/${b.label}`} />
            else label = <>{b.label}</>;

            if (b.type === "LinkExternal")
            {
                btnHtml.push(<Link key={`btn-${b.label}`} to={b.link!} target="_blank" className={`button ${b.color === "Primary" ? "primary" : ""}`}>{label}</Link>)
            }
            else if (b.type === "LinkInternal")
            {
                btnHtml.push(<Link key={`btn-${b.label}`} to={getNavigationNoHook(b.link!, searchParams)} className={`button ${b.color === "Primary" ? "primary" : ""}`}>{label}</Link>)
            }
            else if (b.type === "Custom")
            {
                btnHtml.push(<button disabled={b.disabled} key={`btn-${b.label}`} onClick={b.action} className={b.color === "Primary" ? "primary" : ""}>{label}</button>)
            }
        }
    }

    let mainContent = <></>;
    if (image)
    {
        if (hideNsfw)
        {
            mainContent = <div className={"card-img is-flex flex-center-hor " + imageCssModifiers}><img className="blur" src={image} /></div>
        }
        else
        {
            mainContent = <div className={"card-img is-flex flex-center-hor " + imageCssModifiers}><img className={onClick ? "clickable" : ""} src={image} /></div>
        }
    }
    else if (text)
    {
        mainContent = <p className="card-text" dangerouslySetInnerHTML={{ __html: text! }}></p>
    }
    else if (icons)
    {
        mainContent =
            <div className="is-flex">
                {
                    icons.map(x => <div className="is-flex card-iconlabel">
                        <span className="material-symbols-outlined is-flex flex-center-ver" title={x.alt}>{x.icon}</span>
                        <p className="is-flex flex flex-center-ver">{x.label}</p>
                    </div>)
                }
            </div>
    }
    else if (custom)
    {
        mainContent = custom
    }

    return <div className={`card ${className ? className : ""}`}>
        <p className={"text-center card-name"}>{hideNsfw ? "" : name}</p>
        <div className="card-content"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}>
            { mainContent }
        </div>
        <div className="card-buttons is-flex">
            {
                btnHtml
            }
            {
                highlight ? <div className="is-flex card-iconlabel card-highlight">
                    <span className="material-symbols-outlined is-flex flex-center-ver" title={highlight.alt}>{highlight.icon}</span>
                    <p className="is-flex flex flex-center-ver">{highlight.label}</p>
                </div> : <></>
            }
        </div>
    </div>
}
