import {useEffect, useState} from "react";
import {Task} from "./Task";

export const CompletedList = (props) => {
    const localTime = new Date().toLocaleTimeString();
    const [time, setTime] = useState(localTime);

    const [tasks, setTasks] = useState(props.array);

    useEffect(() => {
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
            <h1 className={`text-lg md:text-2xl text-gray-500 self-start px-5`}>Completed</h1>
            <div
                className={`relative rounded-xl overflow-hidden`}
            >
                <div className={`flex flex-col gap-y-4 p-4 overflow-hidden`}>
                    {
                        tasks === undefined || tasks.length === 0
                            ?
                            <p className={`text-center text-lg md:text-2xl text-gray-400 mt-5 px-10`}>
                                No tasks yet
                            </p>
                            :
                            Object.keys(tasks).map((index) => (
                                <Task
                                    priority={tasks[index].priority}
                                    key={index}
                                    name={tasks[index].name}
                                    notes={tasks[index].description}
                                    status={tasks[index].status}
                                    deadline={tasks[index].deadline}
                                    startTime={tasks[index].startTime}
                                    currentTime={time}
                                    onDelete={() => {
                                        props.onDelete(tasks[index], index);
                                    }}
                                    onRedo={() => {
                                        tasks[index].status = "todo";
                                        props.onRedo(tasks[index], index);
                                    }}
                                />
                            ))}
                </div>
            </div>
        </div>
    )
}