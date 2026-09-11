import { useEffect } from "react";
import { isNsfw } from "../../utils";

export interface ImageGroupModalInfo
{
    data: ImagePreviewInfo[]
    creditName?: string
    creditUrl?: string
}

export interface ImagePreviewInfo
{
    image: string
    nsfw: boolean
}

interface ImageGroupModalFormProps {
    images: ImagePreviewInfo[] | null;
    unsetImage: React.Dispatch<React.SetStateAction<ImageGroupModalInfo | null>>

    creditName?: string
    creditUrl?: string
}

export default function ImageGroupModalForm({ images, unsetImage, creditName, creditUrl }: ImageGroupModalFormProps) {
    useEffect(() => {
        window.addEventListener("mousedown", (e) => { if (e.button === 0) unsetImage(null) })
    }, []);

    if (!images) {
        return <></>
    }

    const pageNsfw = isNsfw();

    return (
        <div className='box modal is-flex flex-center-hor modal-scroll'>
            {
                creditName ? <p><small>Made by {
                        creditUrl ? <a href={creditUrl} target="_blank">{creditName}</a>
                        : creditName
                    }</small></p>
                : <></>
            }
            <div className="flex-break"></div>
            {images.map(image =>
                image.image.endsWith(".mp4")
                ? <video key={image.image} className={image.nsfw && pageNsfw === "SFW" ? "blur" : ""} src={image.image} autoPlay loop muted />
                : <img key={image.image} className={image.nsfw && pageNsfw === "SFW" ? "blur" : ""} src={image.image} />
            )}
        </div>
    )
}