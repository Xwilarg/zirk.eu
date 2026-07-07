import { useState, type ReactElement } from "react"
import { isNsfw } from "../utils"

interface RecapComponentProps
{
    name: string
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
    imageFolder: string
    previewFolder: string
    images: string[]
    nsfwImages: string[]
}

export default function RecapComponent({ name, setPreview, previewFolder, imageFolder, images, nsfwImages }: RecapComponentProps) {
    const [index, setIndex] = useState<number>(0);

    let data: ReactElement[] = [];
    const nsfw = isNsfw() === "NSFW";

    for (let i = 0; i < images.length; i++)
    {
        data.push(
            <div className="recap-img">
                <img className="clickable" key={i} src={`${previewFolder}${nsfw ? nsfwImages[i] : images[i]}`} onClick={() => setIndex(i)} />
            </div>
        )
    }

    return <div className="recap-card box">
        <p className="mark">{ name }</p>
        <div className="recap-img">
            <img className="clickable"
                src={`${previewFolder}${nsfw ? nsfwImages[index] : images[index]}`}
                onClick={() => setPreview(`${imageFolder}${nsfw ? nsfwImages[index] : images[index]}`)}
            />
        </div>
        <div className="recap-list is-flex flex-center-hor">
            { data }
        </div>
    </div>
}
