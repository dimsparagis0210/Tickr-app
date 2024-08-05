import {useUserContext} from "../../store/user-context";
import {useEffect, useState} from "react";
import {useFirebase} from "../../hooks/useFirebase";
import {push, ref, update} from "firebase/database";
import {IsLoggedIn} from "../Auth/IsLoggedIn";
import {Header} from "./UI/Header";
import {Background} from "./UI/Background";
import {NewTaskWindow} from "./NewTask/NewTaskWindow";
import {TaskList} from "./TaskList";

// Todo component: Holds the main logic for the todo list, the state of the tasks, and the methods to handle the tasks
export const Todo = () => {
    //States
    const [taskWindowOpen, setTaskWindowOpen] = useState(false);
    const [order, setOrder] = useState("date");
    const db = useFirebase();
    const context = useUserContext();
    const [input, setInput] = useState({
        name: "",
        description: "",
        deadline: "",
        priority: "",
    });

    //Getting user from local storage
    const user = JSON.parse(localStorage.getItem(context.email));

    // Getting tasks and setting them to the state
    let objectTasks = [];
    if (user) {
        Object.keys(user.tasks).map((item) => {
            objectTasks.push(
                {
                    id: user?.tasks,
                    deadline: user?.tasks[item].deadline,
                    description: user?.tasks[item].description,
                    key: user?.tasks[item].key,
                    name: user?.tasks[item].name,
                    priority: user?.tasks[item].priority,
                    startTime: user?.tasks[item].startTime,
                    status: user?.tasks[item].status,
                }
            );
        });
    }
    const [tasks, setTasks] = useState(objectTasks);

    // Effects
    // Updating the user state when the tasks state changes
    useEffect(() => {
        const newUser = {
            ...user,
            tasks: tasks,
        }
        localStorage.setItem(user?.email, JSON.stringify(newUser));
    }, [tasks])

    // Methods
    // Function to handle the completion of a task
    const completeHandler = (task, index) => {
        setTasks((prevTasks) =>
            prevTasks.map((t, i) => (t.key === task.key ? task : t))
        );
        const updates = {};
        updates[`users/${context.id}/tasks/${task.key}`] = {...task, status: "completed"};

        return update(ref(db), updates).then(() => {
            console.log("Task Completed");
        });
    }

    // Function to handle the redo of a task
    const redoHandler = (task) => {
        setTasks((prevTasks) =>
            prevTasks.map((t, i) => (t.key === task.key ? task : t))
        );
        const updates = {};
        updates[`users/${context.id}/tasks/${task.key}`] = {...task, status: "todo"};

        return update(ref(db), updates).then(() => {
            console.log("Task Reinitialized");
        });
    }

    // Function to handle the deletion of a task
    const deleteHandler = (task) => {
        console.log("Task", task);
        console.log("Id", task.key);
        setTasks((prevTasks) =>
            prevTasks.filter((t, i) => t.key !== task.key)
        );
        const updates = {};
        updates[`users/${context.id}/tasks/${task.key}`] = null;

        return update(ref(db), updates).then(() => {
            console.log("Task Deleted");
        });
    }

    // Function to change the state of the order
    // Triggers a re-render and a re-order of the tasks
    const orderTasks = () => {
        if (order === "date") {
            setOrder("priority");
        } else {
            setOrder("date");
        }
    }

    // Function to save a task to the database
    const saveTask = (uid, task) => {
        return new Promise((resolve, reject) => {
            const newTaskKey = push(ref(db, `users/${uid}/tasks`)).key;
            const updates = {};
            updates[`users/${uid}/tasks/${newTaskKey}`] = task;

            update(ref(db), updates)
                .then(() => {
                    resolve(newTaskKey);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    return (
        <IsLoggedIn>
            <div className={`relative min-h-screen flex flex-col items-center justify-center`}>
                <Header/>
                <Background/>
                <NewTaskWindow
                    taskWindowOpen={taskWindowOpen}
                    onToggle={() => {
                        setTaskWindowOpen(false)
                    }}
                    input={input}
                    user={user}
                    onChangeInput={({name, value}) => {
                        setInput((prevState) => {
                            return (
                                {
                                    ...prevState,
                                    [name]: value,
                                }
                            )
                        });
                    }}
                    onSaveTask={(newTask) => {
                        saveTask(context.id, newTask).then((key) => {
                            newTask.key = key;
                            setTasks((prevState) => {
                                return [
                                    ...prevState,
                                    newTask,
                                ]
                            });
                        }).then(() => {
                            const newUser = {
                                ...user,
                                tasks: tasks,
                            }
                            localStorage.setItem(user.email, JSON.stringify(newUser));
                            setInput({
                                name: "",
                                description: "",
                                deadline: "",
                                priority: "",
                            });
                        });
                    }}
                    onChangePriority={(priority) => {
                        setInput((prevState) => {
                            return {
                                ...prevState,
                                priority: priority,
                            }
                        });
                    }}
                />
                <TaskList
                    onToggleNewTaskWindow={() => {
                        setTaskWindowOpen(true)
                    }}
                    onOrderTasks={orderTasks}
                    order={order}
                    tasks={tasks}
                    onComplete={(task, index) => completeHandler(task, index)}
                    onDelete={(task, index) => deleteHandler(task, index)}
                    onRedo={(task, index) => redoHandler(task, index)}
                />
            </div>
        </IsLoggedIn>
    );
}