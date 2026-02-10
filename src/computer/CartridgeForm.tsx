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
    return <svg onClick={onClick} width={141} height={101}>
        <rect x={16} y={1} width={125} height={100} fill="black" />
        <rect x={1} width={15} y={1} height={80} fill="black" />
        <image
            href={imageUrl}
            x={21} y={6}
            width={115} height={90} 
            preserveAspectRatio="xMidYMid slice"
        />
        <line x1={0} y1={0} x2={141} y2={0} stroke="white" />
        <line x1={15} y1={101} x2={141} y2={101} stroke="white" />
        <line x1={0} y1={0} x2={0} y2={81} stroke="white" />
        <line x1={141} y1={0} x2={141} y2={141} stroke="white" />
        <line x1={0} y1={81} x2={15} y2={81} stroke="white" />
        <line x1={15} y1={81} x2={15} y2={141} stroke="white" />
        <text textAnchor="middle" transform="translate(16,41) rotate(-90)" fill="white">{type}</text>
    </svg>
});

export default CartridgeForm;