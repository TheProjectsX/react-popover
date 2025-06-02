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
    onWrapperBlur = (e) => {},
    viewOnHover = false,
    closeOnClick = true,
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
        "data-name": "popover-trigger",
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

        if (triggerRect.top - gap - contentRect.height > 0) {
            possiblePositions.push("top");
        }

        if (triggerRect.bottom + gap + contentRect.height < innerHeight) {
            possiblePositions.push("bottom");
        }

        if (triggerRect.left - gap - contentRect.width > 0) {
            possiblePositions.push("left");
        }

        if (triggerRect.right + gap + contentRect.width < innerWidth) {
            possiblePositions.push("right");
        }

        if (possiblePositions.includes(position)) return position;

        if (possiblePositions.includes(oppositePosition[position]))
            return oppositePosition[position];

        if (possiblePositions.length > 0) return possiblePositions[0];

        if (position === "top" || position === "bottom") {
            const topSpace = triggerRect.top - gap - contentRect.height;
            const bottomSpace =
                innerHeight - triggerRect.bottom + gap + contentRect.height;

            return topSpace < bottomSpace ? "top" : "bottom";
        }

        if (position === "left" || position === "right") {
            const leftSpace = triggerRect.left - gap - contentRect.width;
            const rightSpace =
                innerWidth - triggerRect.right + gap + contentRect.width;

            return leftSpace < rightSpace ? "left" : "right";
        }

        return position;
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

        const axisToUse = axis === "center" || isSameAxis ? "center" : axis;

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

        setPopoverStyle({
            content: popoverContentStyles,
        });
    };

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver(updatePositions);
        triggerRef.current && resizeObserver.observe(triggerRef.current);
        contentRef.current && resizeObserver.observe(contentRef.current);

        window.addEventListener("resize", updatePositions);
        window.addEventListener("scroll", updatePositions, true);

        updatePositions();

        return () => {
            resizeObserver.disconnect();
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

    // Update position if `content` and `wrapper` element exists
    useEffect(() => {
        if (!contentRef.current || !wrapperRef.current) return;

        updatePositions();
    }, [contentRef.current, wrapperRef.current]);

    return (
        <div
            data-name="popover-container"
            className="rpx__container"
            tabIndex={-1}
            style={parentStyles}
            ref={wrapperRef}
        >
            {clonedTrigger}

            {mounted &&
                createPortal(
                    <div
                        data-name="popover-content"
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
