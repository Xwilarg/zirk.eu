import { useState, type ReactElement } from "react"

interface RecapComponentProps
{
    name: string
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
    previews: string[]
    images: string[]
}

export default function RecapComponent({ name, setPreview, images, previews }: RecapComponentProps) {
    const [index, setIndex] = useState<number>(0);

    let data: ReactElement[] = [];

    for (let i = 0; i < images.length; i++)
    {
        data.push(
            <div className="recap-img">
                <img className="clickable" key={i} src={previews[i]} onClick={() => setIndex(i)} />
            </div>
        )
    }

    return <div className="recap-card box">
        <p className="mark">{ name }</p>
        <div className="recap-img">
            <img className="clickable" src={previews[index]} onClick={() => setPreview(images[index])} />
        </div>
        <div className="recap-list is-flex flex-center-hor">
            { data }
        </div>
    </div>
}
