// Task component: Holds the logic for every task in the tasks list
export const Task = (props) => {
    return (
        <div className={`relative flex flex-col px-4 py-2 sm:px-5 sm:py-2 lg:px-10 lg:py-3 h-fit bg-white rounded-xl gap-y-5 lg:gap-y-10 hover:cursor-pointer`}
             style={{
                 boxShadow: `15px 0px 0px -5px ${props.priority} inset`
             }}
        >

            <header className={`flex gap-x-5 justify-between`}>
                <section className={`flex flex-col`}>
                    <h2 className={`self-start text-lg sm:text-xl lg:text-3xl`}>{props.name}</h2>
                    <p className={`text-xs sm:text-sm lg:text-md`}>{props.notes}</p>
                </section>
                <section className={`flex flex-col gap-y-2`}>
                    {
                        props.onComplete &&
                            <button className={`p-2 sm:p-2 lg:p-4 text-xs sm:text-sm md:text-md rounded-md sm:rounded-xl text-gray-400 shadow-xl hover:text-white`} style={{
                                background: "rgba(0, 0, 0, 0.1)",
                                backdropFilter: `blur(10px)`,
                            }}
                                    onClick={() => {
                                        console.log("Completed");
                                        props.onComplete();
                                    }}
                            >
                                Complete
                            </button>
                    }
                    {
                        props.onComplete &&
                            <button className={`p-2 sm:p-2 lg:p-4 text-xs sm:text-sm md:text-md rounded-md sm:rounded-xl bg-gradient-to-r from-orange-600 to-red-600
                                text-white shadow-xl hover:text-white`}
                                    onClick={() => {
                                        console.log("Completed");
                                        props.onDelete();
                                    }}
                            >
                                Delete
                            </button>
                    }
                    {
                        !props.onComplete &&
                        <button
                            className={`p-2 sm:p-2 lg:p-4 text-xs sm:text-sm md:text-md rounded-md sm:rounded-xl text-gray-400 shadow-xl hover:text-white`}
                            style={{
                                background: "rgba(0, 0, 0, 0.1)",
                                backdropFilter: `blur(10px)`,
                            }}
                            onClick={() => {
                                props.onDelete();
                            }}
                        >
                            Delete
                        </button>
                    }
                    {
                        props.onRedo &&
                        <button
                            className={`p-2 sm:p-2 lg:p-4 text-xs sm:text-sm md:text-md rounded-md sm:rounded-xl bg-gradient-to-r from-green-300 to-emerald-300 text-white shadow-xl hover:text-white`}
                            onClick={() => {
                                props.onRedo();
                            }}
                        >
                            Redo
                        </button>
                    }
                </section>

            </header>
            <section className={`flex flex-col lg:flex-row gap-1 lg:gap-10 w-fit`}>
                <p className={`text-xs sm:text-sm`}>Started at <span
                    className={`font-bold text-sm sm:text-md lg:text-xl`}>{props.startTime}</span></p>
                <p className={`text-xs sm:text-sm lg:text-md`}>Deadline <span
                    className={`text-xs sm:text-lg lg:text-2xl`}>{props.deadline}</span></p>
            </section>
        </div>
    );
}