# React Popover

A lightweight and flexible React Popover / Tooltip component.

-   ⚡ **No ID or Ref needed** — just wrap and go!
-   🎨 **Full control** — no default styles applied to your content.
-   🧠 **Simple API** — intuitive props for easy customization.

---

## 🌐 Demo

Checkout [Demo of react-popover](https://modasser.is-a.dev/react-popover/)

## 🚀 Installation

```bash
npm install @theprojectsx/react-popover
# or
yarn add @theprojectsx/react-popover
```

---

## 💡 Usage

```jsx
import Popover from "@theprojectsx/react-popover";

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

---

## ⚙️ Props

| Prop              | Type                                                 | Default    | Description                                                        |
| ----------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `content`         | `React.ReactNode`                                    | —          | Content to show inside the popover                                 |
| `className`       | `string`                                             | —          | Class for the content wrapper                                      |
| `parentStyles`    | `React.CSSProperties`                                | —          | Inline styles for the parent element                               |
| `position`        | `"top" \| "bottom" \| "left" \| "right"`             | `"bottom"` | Where the popover appears relative to trigger                      |
| `axis`            | `"center" \| "top" \| "bottom" \| "left" \| "right"` | `"center"` | Axis alignment of the popover                                      |
| `triggerType`     | `"auto" \| "manual"`                                 | `"auto"`   | Whether to trigger on interaction or control manually              |
| `contentVisible`  | `boolean`                                            | `false`    | Show/hide popover manually (used when `triggerType` is `"manual"`) |
| `viewOnHover`     | `boolean`                                            | `true`     | Show popover on hover instead of click (only in `auto` mode)       |
| `closeOnClick`    | `boolean`                                            | `true`     | Close Popover when clicked in trigger                              |
| `onWrapperBlur`   | `(e) => void`                                        | —          | Called when user clicks outside the popover                        |
| `onStatusChanged` | `(status: boolean) => void`                          | —          | Called when Status of popover changes while `triggerType = auto`   |
| `gap`             | `number`                                             | `10`       | Used to decide the gap between trigger and content                 |

---

## 🧪 License

MIT © [@theprojectsx](https://github.com/theprojectsx)
