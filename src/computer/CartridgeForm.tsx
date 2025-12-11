import { forwardRef } from "react";

interface CartridgeFormProps
{
    onClick: () => void,
    imageUrl: string,
    color: string
}

const CartridgeForm = forwardRef((
    { onClick, imageUrl, color }: CartridgeFormProps,
    _
) => {
    return <svg onClick={onClick} width={125} height={100}>
        <rect width={125} height={100} fill={color} />
        <image
            href={imageUrl}
            x={5} y={5}
            width={115} height={90} 
            preserveAspectRatio="xMidYMid slice"
        />
    </svg>
});

export default CartridgeForm;