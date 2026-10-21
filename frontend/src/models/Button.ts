type ButtonType = "LinkExternal" | "LinkInternal" | "Custom"
type ButtonColor = "Primary" | "Default"
type LabelType = "Text" | "GoogleIcon" | "LocalIcon"

export interface Button
{
    disabled?: boolean
    type: ButtonType
    color: ButtonColor
    labelType: LabelType
    label: string
    link?: string
    action?: () => void
}