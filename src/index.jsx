import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./index.css";

const Popover = ({
    children,
    content,
    parentStyles = {},
    className = "",
    position = "bottom",
    axis = "center",
    triggerType = "auto",
    contentVisible = false,
    viewOnHover = false,
    closeOnClick = true,
    onWrapperBlur = (e) => {},
    onStatusChanged = (status) => {},
    gap = 8,
}) => {
    const [mounted, setMounted] = useState(null);
    const [popoverOpened, setPopoverOpened] = useState(false);

    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    const [popoverStyle, setPopoverStyle] = useState({
        content: {
            top: 0,
            left: 0,
        },
    });

    const clonedTrigger = React.cloneElement(children, {
        ref: triggerRef,
        className: `${children.props.className || ""} rpx__trigger`,
        "data-rpx__name": "popover-trigger",
        tabIndex: 0,
        onClick: () =>
            triggerType === "auto"
                ? setPopoverOpened((prev) => (closeOnClick ? !prev : true))
                : children.props.onClick?.(),
        onMouseEnter: () =>
            viewOnHover
                ? setPopoverOpened(true)
                : children.props.onMouseEnter?.(),
        onMouseLeave: () =>
            viewOnHover
                ? setPopoverOpened(false)
                : children.props.onMouseLeave?.(),
    });

    const calculatePosition = (position, gap, triggerRect, contentRect) => {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        const oppositePosition = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left",
        };

        const possiblePositions = [];

        const startingPos = {
            top: triggerRect.top - gap - contentRect.height,
            bottom: triggerRect.bottom + gap + contentRect.height,
            left: triggerRect.left - gap - contentRect.width,
            right: triggerRect.right + gap + contentRect.width,
        };

        if (startingPos.top > 0) {
            possiblePositions.push("top");
        }

        if (startingPos.bottom < innerHeight) {
            possiblePositions.push("bottom");
        }

        if (startingPos.left > 0) {
            possiblePositions.push("left");
        }

        if (startingPos.right < innerWidth) {
            possiblePositions.push("right");
        }

        if (possiblePositions.includes(position)) return position;

        if (possiblePositions.includes(oppositePosition[position]))
            return oppositePosition[position];

        if (possiblePositions.length > 0) return possiblePositions[0];

        if (position === "top" || position === "bottom") {
            const topSpace = startingPos.top;
            const bottomSpace = innerHeight - startingPos.bottom;

            return topSpace < bottomSpace ? "top" : "bottom";
        }

        if (position === "left" || position === "right") {
            const leftSpace = startingPos.left;
            const rightSpace = innerWidth - startingPos.right;

            return leftSpace < rightSpace ? "left" : "right";
        }

        return position;
    };

    const calculateAxis = (axis, triggerRect, contentRect) => {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        const oppositePosition = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left",
        };

        const possiblePositions = [];

        const endingPos = {
            top: triggerRect.top + contentRect.height,
            bottom: triggerRect.bottom - contentRect.height,
            left: triggerRect.left + contentRect.width,
            right: triggerRect.right - contentRect.width,
        };

        if (endingPos.top < innerHeight) {
            possiblePositions.push("top");
        }

        if (endingPos.bottom > 0) {
            possiblePositions.push("bottom");
        }

        if (endingPos.left < innerWidth) {
            possiblePositions.push("left");
        }

        if (endingPos.right > 0) {
            possiblePositions.push("right");
        }

        if (possiblePositions.includes(axis)) return axis;

        if (possiblePositions.includes(oppositePosition[axis]))
            return oppositePosition[axis];

        if (possiblePositions.length > 0) return possiblePositions[0];

        if (axis === "top" || axis === "bottom") {
            const topSpace = innerHeight - endingPos.top;
            const bottomSpace = endingPos.bottom;

            return topSpace < bottomSpace ? "top" : "bottom";
        }

        if (axis === "left" || axis === "right") {
            const leftSpace = innerWidth - endingPos.left;
            const rightSpace = endingPos.right;

            return leftSpace < rightSpace ? "left" : "right";
        }

        return axis;
    };

    const isEqual = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        return keys1.every(
            (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
        );
    };

    const updatePositions = () => {
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        if (!triggerRect || !contentRect) return;

        const triggerWidth = triggerRect?.width ?? 0;
        const triggerHeight = triggerRect?.height ?? 0;
        const triggerPos = {
            top: triggerRect?.top ?? 0,
            bottom: triggerRect?.bottom ?? 0,
            left: triggerRect?.left ?? 0,
            right: triggerRect?.right ?? 0,
        };

        const contentWidth = contentRect?.width ?? 0;
        const contentHeight = contentRect?.height ?? 0;

        const popoverContentStyles = {};

        const finalPosition = calculatePosition(
            position,
            gap,
            triggerRect,
            contentRect
        );

        const isVertical = ["top", "bottom"].includes(finalPosition);
        let relativePos;

        if (finalPosition === "top") {
            relativePos = triggerPos.top - contentHeight - gap;
        } else if (finalPosition === "bottom") {
            relativePos = triggerPos.bottom + gap;
        } else if (finalPosition === "left") {
            relativePos = triggerPos.left - contentWidth - gap;
        } else if (finalPosition === "right") {
            relativePos = triggerPos.right + gap;
        }

        popoverContentStyles[isVertical ? "top" : "left"] = `${relativePos}px`;

        const isSameAxis =
            (["top", "bottom"].includes(position) &&
                ["top", "bottom"].includes(axis)) ||
            (["left", "right"].includes(position) &&
                ["left", "right"].includes(axis));

        const axisToUse =
            axis === "center" || isSameAxis
                ? "center"
                : calculateAxis(axis, triggerRect, contentRect);

        let relativeAxis;

        if (axisToUse === "top") {
            relativeAxis = triggerPos.top;
        } else if (axisToUse === "bottom") {
            relativeAxis = triggerPos.bottom - contentHeight;
        } else if (axisToUse === "left") {
            relativeAxis = triggerPos.left;
        } else if (axisToUse === "right") {
            relativeAxis = triggerPos.right - contentWidth;
        }

        if (axisToUse === "center") {
            const key = isVertical ? "left" : "top";

            const offset = isVertical
                ? triggerPos.left + triggerWidth / 2 - contentWidth / 2
                : triggerPos.top + triggerHeight / 2 - contentHeight / 2;

            popoverContentStyles[key] = `${offset}px`;
        } else {
            popoverContentStyles[
                ["top", "bottom"].includes(axisToUse) ? "top" : "left"
            ] = `${relativeAxis}px`;
        }

        setPopoverStyle((prev) =>
            isEqual(prev.content, popoverContentStyles)
                ? prev
                : { content: popoverContentStyles }
        );
    };

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver(updatePositions);
        triggerRef.current && resizeObserver.observe(triggerRef.current);
        contentRef.current && resizeObserver.observe(contentRef.current);

        const mutationObserver = new MutationObserver(updatePositions);
        mutationObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
        });

        window.addEventListener("resize", updatePositions);
        window.addEventListener("scroll", updatePositions, true);

        updatePositions();

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("resize", updatePositions);
            window.removeEventListener("scroll", updatePositions, true);
        };
    }, []);

    useEffect(() => {
        const handleWindowClick = (e) => {
            if (!popoverOpened && !contentVisible) return;

            const target = e.target;

            if (
                wrapperRef.current &&
                contentRef.current &&
                !wrapperRef.current.contains(target) &&
                !contentRef.current.contains(target)
            ) {
                if (triggerType === "auto") {
                    setPopoverOpened(false);
                }
                onWrapperBlur(e);
            } else if (
                contentRef.current &&
                contentRef.current.contains(target) &&
                (target.closest("a") || target.closest("button"))
            ) {
                if (triggerType === "auto") {
                    setPopoverOpened(false);
                }
            }
        };

        document.addEventListener("click", handleWindowClick);

        return () => {
            document.removeEventListener("click", handleWindowClick);
        };
    }, [popoverOpened, contentVisible, triggerType]);

    // Set Mounted so that we can use `document`
    useEffect(() => {
        setMounted(true);
    }, []);

    // On Status Changed
    useEffect(() => {
        onStatusChanged(popoverOpened);
    }, [popoverOpened]);

    return (
        <div
            data-rpx__name="popover-container"
            className="rpx__container"
            tabIndex={-1}
            style={parentStyles}
            ref={wrapperRef}
        >
            {clonedTrigger}

            {mounted &&
                createPortal(
                    <div
                        data-rpx__name="popover-content"
                        className={`rpx__content ${
                            triggerType === "auto"
                                ? "rpx__content--visible-controlled"
                                : contentVisible
                                ? "rpx__content--visible"
                                : "rpx__content--invisible"
                        } ${
                            viewOnHover ? "rpx__content--on-hover" : ""
                        } ${className}`}
                        style={popoverStyle.content}
                        ref={contentRef}
                        data-popover-visible={popoverOpened}
                        tabIndex={0}
                    >
                        {content ?? ""}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default Popover;
