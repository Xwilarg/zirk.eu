import { useState, type ReactElement } from "react"

interface RecapComponentProps
{
    name: string
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
    images: string[]
}

export default function RecapComponent({ name, setPreview, images }: RecapComponentProps) {
    const [index, setIndex] = useState<number>(0);

    let data: ReactElement[] = [];

    for (let i = 0; i < images.length; i++)
    {
        data.push(
            <div className="recap-img">
                <img className="clickable" key={i} src={images[i]} onClick={() => setIndex(i)} />
            </div>
        )
    }

    return <div className="recap-card box">
        <p className="mark">{ name }</p>
        <div className="recap-img">
            <img className="clickable" src={images[index]} onClick={() => setPreview(images[index])} />
        </div>
        <div className="recap-list is-flex flex-center-hor">
            { data }
        </div>
    </div>
}
