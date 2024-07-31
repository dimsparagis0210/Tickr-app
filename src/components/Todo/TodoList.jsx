import {useEffect, useState} from "react";
import {Task} from "./Task";

export const TodoList = (props) => {
    const localTime = new Date().toLocaleTimeString();
    const [time, setTime] = useState(localTime);
    const [tasks, setTasks] = useState(props.array);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const filteredTasks = props.array.filter((task) => task.status === "todo");
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
            <h1 className={`text-2xl text-gray-500 self-start px-5`}>To-Do</h1>
            <div
                className={`relative rounded-xl overflow-hidden`}
            >
                <div className={`flex flex-col gap-y-4 p-4 overflow-hidden`}>
                    {
                        tasks === null || tasks.length === 0
                            ?
                            <p className={`text-center text-2xl text-gray-400 mt-5 px-10`}>
                                No tasks yet
                            </p>
                            :
                            Object.keys(tasks).map((index) => (
                                <Task
                                    priority={tasks[index].priority}
                                    name={tasks[index].name}
                                    notes={tasks[index].notes}
                                    status={tasks[index].status}
                                    time={tasks[index].time}
                                    currentTime={time}
                                    onComplete={() => {
                                        tasks[index].status = "completed";
                                        console.log("Completed");
                                        props.onComplete(tasks[index]);
                                    }}
                                    onDelete={() => {
                                        console.log("Delete ToDo List");
                                        console.log(tasks[index], index);
                                        props.onDelete(tasks[index], index);
                                    }}
                                />
                        ))}
                </div>
            </div>
        </div>
    )
}