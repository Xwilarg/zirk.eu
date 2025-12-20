import { forwardRef } from "react";

interface CartridgeFormProps
{
    onClick: () => void,
    imageUrl: string,
    type: CartridgeType
}

export type CartridgeType = "Gamejam" | "Sketch";

const CartridgeForm = forwardRef((
    { onClick, imageUrl, type }: CartridgeFormProps,
    _
) => {
    return <svg onClick={onClick} width={140} height={100}>
        <rect x={15} width={125} height={100} fill="black" />
        <rect width={15} height={80} fill="black" />
        <image
            href={imageUrl}
            x={20} y={5}
            width={115} height={90} 
            preserveAspectRatio="xMidYMid slice"
        />
        <text textAnchor="middle" transform="translate(15,40) rotate(-90)" fill="white">{type}</text>
    </svg>
});

export default CartridgeForm;