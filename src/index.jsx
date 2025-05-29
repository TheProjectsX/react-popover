import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    onWrapperBlur = () => {},
    viewOnHover = false,
    closeOnClick = true,
}) => {
    const [popoverOpened, setPopoverOpened] = useState(false);

    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    const [popoverStyle, setPopoverStyle] = useState({
        content: {},
        indicator: {},
    });

    const clonedTrigger = React.cloneElement(children, {
        ref: triggerRef,
        className: `${children.props.className || ""} rpx__trigger`,
        "data-name": "popover-trigger",
        tabIndex: 0,
        onClick: () =>
            triggerType === "auto"
                ? setPopoverOpened((prev) => (closeOnClick ? !prev : prev))
                : null,
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
        const gap = 10;
        const indicatorGap = 6;
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        if (!triggerRect || !contentRect) return;

        const contentWidth = contentRect?.width ?? 0;
        const contentHeight = contentRect?.height ?? 0;
        const triggerWidth = triggerRect?.width ?? 0;
        const triggerHeight = triggerRect?.height ?? 0;

        const popoverContentStyles = {};
        const popoverIndicatorStyles = {};

        const size =
            position === "top" || position === "bottom"
                ? triggerHeight ?? 0
                : triggerWidth ?? 0;

        const oppositeSide = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left",
        };

        const finalPosition = calculatePosition(
            position,
            gap,
            triggerRect,
            contentRect
        );

        popoverIndicatorStyles[oppositeSide[finalPosition]] = `${
            indicatorGap * -1
        }px`;
        popoverContentStyles[oppositeSide[finalPosition]] = `${size + gap}px`;

        const oppositeAxis = {
            top: ["top", "bottom"],
            bottom: ["top", "bottom"],
            left: ["left", "right"],
            right: ["left", "right"],
            center: ["center"],
        };

        const sameAxis = oppositeAxis[axis]?.includes(position);
        const axisToUse = axis === "center" || sameAxis ? "center" : axis;

        if (axisToUse === "center") {
            const isVertical = position === "top" || position === "bottom";
            const offset = isVertical
                ? contentWidth / 2 - triggerWidth / 2
                : contentHeight / 2 - triggerHeight / 2;

            const key = isVertical ? "left" : "top";
            const centerIndicatorOffset = isVertical
                ? contentWidth / 2 - 8
                : contentHeight / 2 - 8;

            popoverContentStyles[key] = `${-offset}px`;
            popoverIndicatorStyles[key] = `${centerIndicatorOffset}px`;
        } else {
            popoverContentStyles[axisToUse] = "0px";
            popoverIndicatorStyles[axisToUse] = `${indicatorGap}px`;
        }

        setPopoverStyle((prev) => ({
            content: popoverContentStyles,
            indicator: popoverIndicatorStyles,
        }));
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
                onWrapperBlur();
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

    return (
        <div
            data-name="popover-container"
            className="rpx__container"
            tabIndex={-1}
            style={parentStyles}
            ref={wrapperRef}
        >
            {clonedTrigger}

            <div
                data-name="popover-content"
                className={`rpx__content
                    ${
                        triggerType === "auto"
                            ? viewOnHover
                                ? "rpx__content--hover-opened"
                                : popoverOpened
                                ? "rpx--visible-important"
                                : ""
                            : contentVisible
                            ? "rpx--visible-important"
                            : ""
                    }
                    ${className || ""}`}
                style={popoverStyle.content}
                ref={contentRef}
                tabIndex={0}
            >
                {content ?? ""}
            </div>
        </div>
    );
};

export default Popover;
