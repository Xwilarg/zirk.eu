import { useEffect } from "react";

interface ImageModalFormProps {
    image: string | null;
    unsetImage: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ImageModalForm({ image, unsetImage }: ImageModalFormProps) {
    useEffect(() => {
        window.addEventListener("mousedown", (e) => { if (e.button === 0) unsetImage(null) })
        window.addEventListener("scroll", () => unsetImage(null))
    }, []);

    if (!image) {
        return <></>
    }

    return (
        <div className='box modal is-flex flex-center-hor'>
            <img src={image} />
        </div>
    )
}