import { useState } from "react";
import Popover from "@theprojectsx/react-popover";

function App() {
    const [opened, setOpened] = useState(false);

    return (
        <div className="w-full h-screen flex items-center justify-center gap-10">
            <Popover
                position="bottom"
                axis="center"
                // gap={2}
                content={
                    <div className="min-w-40 rounded-lg overflow-hidden shadow text-sm bg-white">
                        <button className="block w-full py-2.5 hover:bg-gray-100 cursor-pointer text-left px-6">
                            Hey!
                        </button>
                        <button className="block w-full py-2.5 hover:bg-gray-100 cursor-pointer text-left px-6">
                            Howdy!
                        </button>
                    </div>
                }
                indicator
            >
                <button className="px-4 py-2 rounded-lg border-2 cursor-pointer">
                    Click
                </button>
            </Popover>

            <Popover
                viewOnHover
                content={
                    <div className="min-w-40 rounded-lg overflow-hidden shadow text-sm dark:bg-gray-800 dark:text-white">
                        <button className="block w-full py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-left px-6">
                            Hey!
                        </button>
                        <button className="block w-full py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-left px-6">
                            Howdy!
                        </button>
                    </div>
                }
                indicator
            >
                <button className="px-4 py-2 rounded-lg border-2 cursor-pointer">
                    Hover
                </button>
            </Popover>
            <Popover
                triggerType="manual"
                contentVisible={opened}
                onWrapperBlur={(e) => console.log(e)}
                content={
                    <div className="min-w-40 rounded-lg overflow-hidden shadow text-sm">
                        <button className="block w-full py-2.5 hover:bg-gray-100 cursor-pointer text-left px-6">
                            Hey!
                        </button>
                        <button className="block w-full py-2.5 hover:bg-gray-100 cursor-pointer text-left px-6">
                            Howdy!
                        </button>
                    </div>
                }
                indicator
            >
                <button
                    className="px-4 py-2 rounded-lg border-2 cursor-pointer"
                    onClick={() => setOpened((prev) => !prev)}
                >
                    Controlled
                </button>
            </Popover>

            <button
                className="px-4 py-2 rounded-lg border-2 cursor-pointer"
                onClick={() => setOpened((prev) => !prev)}
            >
                Another
            </button>
        </div>
    );
}

export default App;
