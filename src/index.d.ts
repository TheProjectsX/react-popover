import React from "react";

export interface PopoverProps {
    children: React.ReactElement<any, any>;
    content: string | React.ReactNode;
    parentStyles?: React.CSSProperties;
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    axis?: "top" | "bottom" | "left" | "right" | "center";
    triggerType?: "auto" | "manual";
    contentVisible?: boolean;
    onWrapperBlur?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    viewOnHover?: boolean;
    closeOnClick?: boolean;
    gap?: number;
}

export default function Popover(props: PopoverProps): React.ReactElement;
