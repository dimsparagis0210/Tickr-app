import {useEffect, useState} from "react";
import {Task} from "./Task";

//TodoList component: This component is responsible for rendering the list of tasks with status "todo"
export const TodoList = (props) => {
    const localTime = new Date().toLocaleTimeString();
    const [time, setTime] = useState(localTime);
    const [tasks, setTasks] = useState(props.array);

    useEffect(() => {
        const filteredTasks = props.array.filter((task) => task.status === "todo");
        console.log(props.order);
        // If order = date, then change the sort in a priority based order
        if (props.order === 'date') {
            const priorityMap = {
                "rgba(238, 42, 42, 0.8)": 2,
                "rgba(255, 196, 58, 0.8)": 1,
                "rgba(173, 255, 122, 0.8)": 0,
            };

            filteredTasks.sort((a, b) => {
                return priorityMap[b.priority] - priorityMap[a.priority];
            });
            console.log("Filtered Tasks", filteredTasks);
            setTasks(filteredTasks);
        } else {
            // Sort tasks by the time they were added (Descending order)
            filteredTasks.sort((a, b) => {
                const [hoursA, minutesA] = a.startTime.split(':').map(Number);
                const [hoursB, minutesB] = b.startTime.split(':').map(Number);

                const totalMinutesA = hoursA * 60 + minutesA;
                const totalMinutesB = hoursB * 60 + minutesB;

                return totalMinutesB - totalMinutesA;
            });
        }
        setTasks(filteredTasks);
    }, [props.array, props.order]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <div className={`h-full`}>
            <h1 className={`text-lg lg:text-2xl text-gray-500 self-start px-5`}>To-Do</h1>
            <div
                className={`relative rounded-xl overflow-hidden`}
            >
                <div className={`flex flex-col gap-y-4 p-4 overflow-hidden`}>
                    {
                        tasks === null || tasks.length === 0
                            ?
                            <p className={`text-center text-lg lg:text-2xl text-gray-400 mt-5 px-10`}>
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
                                    onComplete={() => {
                                        tasks[index].status = "completed";
                                        props.onComplete(tasks[index], index);
                                    }}
                                    onDelete={() => {
                                        props.onDelete(tasks[index], index);
                                    }}
                                />
                        ))}
                </div>
            </div>
        </div>
    )
}