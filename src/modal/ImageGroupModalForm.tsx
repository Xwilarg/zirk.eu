import { useEffect } from "react";

interface ImageGroupModalFormProps {
    images: string[] | null;
    unsetImage: React.Dispatch<React.SetStateAction<string[] | null>>
}

export default function ImageGroupModalForm({ images, unsetImage }: ImageGroupModalFormProps) {
    useEffect(() => {
        window.addEventListener("mousedown", (e) => { if (e.button === 0) unsetImage(null) })
    }, []);

    if (!images) {
        return <></>
    }

    return (
        <div className='box modal is-flex flex-center-hor modal-scroll'>
            {images.map(image => <img src={image} />)}
        </div>
    )
}