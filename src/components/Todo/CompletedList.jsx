import {useEffect, useState} from "react";

export const CompletedList = (props) => {
    const localTime = new Date().toLocaleTimeString();
    const [time, setTime] = useState(localTime);

    const [tasks, setTasks] = useState(props.array);

    useEffect(() => {
        console.log("Completed array changed")
        const filteredTasks = props.array.filter((task) => task.status === "completed");
        setTasks(filteredTasks);
    }, [props.array]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <div className={`h-full`}>
            <h1 className={`text-2xl text-gray-500 self-start px-5`}>Completed</h1>
            <div
                className={`relative rounded-xl overflow-hidden`}
            >
                <div className={`flex flex-col gap-y-4 p-4 overflow-hidden`}>
                    {
                        tasks === undefined || tasks.length === 0
                            ?
                            <p className={`text-center text-2xl text-gray-400 mt-5 px-10`}>
                                No tasks yet
                            </p>
                            :
                            tasks.map((task, index) => (
                                <div className={`flex gap-4 justify-center`}>
                                    <div className={`flex flex-col px-10 py-3 h-fit bg-white rounded-xl gap-y-10`}
                                         style={{
                                             boxShadow: `15px 0px 0px -5px ${task.priority} inset`
                                         }}
                                         key={index}
                                    >
                                        <header className={`flex justify-between`}>
                                            <section className={``}>
                                                <h2 className={`self-start text-3xl`}>{task.name}</h2>
                                                <p className={`text-gray-400`}>{task.notes}</p>
                                            </section>
                                            <button className={`p-4 rounded-xl text-gray-400 shadow-xl hover:text-white`}
                                                    style={{
                                                        background: "rgba(0, 0, 0, 0.1)",
                                                        backdropFilter: `blur(10px)`,
                                                    }}
                                                    onClick={() => props.onDelete(task, index)}
                                            >
                                                Delete
                                            </button>
                                        </header>
                                        <section className={`flex gap-10`}>
                                            <p className={`self-end`}>Started at <span
                                                className={`font-bold text-xl`}>{task.time}</span></p>
                                            <p className={`self-end`}>Available time <span
                                                className={`text-2xl`}>{time}</span></p>
                                        </section>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </div>
    )
}