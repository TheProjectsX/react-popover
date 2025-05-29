# React Popover / React Tooltip

-   Easy to use React Popover.
-   No more need to create ID or Ref to use tooltip!
-   User has full control over the content wrapper, no additional styles have been added

How to Use:

```jsx
import Popover from "@/components/Popover";

const Page = () => {
    return (
        <div>
            <Popover
                content={<p className="p-4">Here Lies some useful content</p>}
                position="bottom"
                axis="center"
            >
                <button className="px-5 py-2 rounded-2xl bg-neutral-200 cursor-pointer">
                    Click ME!
                </button>
            </Popover>
        </div>
    );
};

export default Page;
```

## API:

-   `content`: Expects content which will be shown
-   `className`: Class names which can be given to the `content` wrapper
-   `parentStyles`: Styles to give parent Element. Not classnames, but React.CSSProperties!
-   `position`: In which position the `content` will be shown. Options:
    -   `top`, `bottom` (default), `left`, `right`
-   `axis`: In which axis will the content be shown. Options:
    -   `center` (Default), `top`, `bottom`, `left`, `right`
-   `triggerType`: Should the Popover be triggered `auto` or `manual`. Manual type will require below property also:
-   `contentVisible`: If the `content` is visible or not. Expects Boolean (Default `false`)
-   `onWrapperBlur`: Takes a function as an property. Runs when user clicks outside the Popover wrapper
-   `viewOnHover`: Views content when hover-ed on trigger, instead of click. Expects Boolean (Default `true`)
