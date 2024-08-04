import {UserContext, useUserContext} from "../../store/user-context";
import {useEffect, useRef, useState} from "react";
import {TodoList} from "./TodoList";
import {CompletedList} from "./CompletedList";
import {NewTaskInput} from "./NewTaskInput";
import {colors, inputs} from "../../data/data";
import {useNavigate} from "react-router-dom";
import {useFirebase} from "../../hooks/useFirebase";
import {push, ref, update} from "firebase/database";
import {IsLoggedIn} from "../Auth/IsLoggedIn";
import {Header} from "./Header";
import {Background} from "./Background";
import {NewTaskWindow} from "./NewTaskWindow";

export const Todo = () => {
    //States
    const [taskWindowOpen, setTaskWindowOpen] = useState(false);

    const [order, setOrder] = useState("date");
    const navigate = useNavigate();
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
    console.log("User", user);
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
    console.log("Tasks", objectTasks);
    const [tasks, setTasks] = useState(objectTasks);

    useEffect(() => {
        const newUser = {
            ...user,
            tasks: tasks,
        }
        localStorage.setItem(user?.email, JSON.stringify(newUser));
    }, [tasks])

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

    const logOutHandler = () => {
        localStorage.removeItem(context.email);
        console.log("Logged out");
        navigate("/log-in");
    }

    const orderTasks = () => {
        if (order === "date") {
            setOrder("priority");
        } else {
            setOrder("date");
        }
    }

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
                <Header onLogOut={logOutHandler}/>
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
                <div className={`relative flex flex-col items-center rounded-xl shadow-2xl`}
                     style={{
                         background: "rgba(0, 0, 0, 0.1)",
                         backdropFilter: `blur(10px)`,
                     }}
                >
                    <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl absolute right-10 top-5
                                        hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                        px-4 py-3 md:px-5 md:py-4 
                                        `}
                            onClick={() => {
                                setTaskWindowOpen(true)
                            }}
                    >
                        Create
                    </button>
                    <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl absolute left-10 top-5
                                        hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                        px-4 py-3 md:px-5 md:py-4 
                                        `}
                            onClick={() => {
                                orderTasks()
                            }}
                    >
                        Order by {order}
                    </button>
                    <main
                        className={`flex flex-col items-center w-[30rem] h-[30rem] md:w-[50rem] md:h-[40rem] overflow-scroll`}>

                        <h1 className={`text-2xl md:text-4xl text-gray-700 font-bold mb-4 p-10`}>Your Tasks</h1>
                        <div className={`flex`}>
                            <section className={`flex flex-col gap-y-10`}>
                                <TodoList
                                    order={order}
                                    array={tasks}
                                    onComplete={(task, index) => completeHandler(task, index)}
                                    onDelete={(task, index) => deleteHandler(task, index)}
                                />
                            </section>
                            <section className={`flex flex-col gap-y-10 overflow-y-auto`}>
                                <CompletedList
                                    array={tasks}
                                    onDelete={(task, index) => deleteHandler(task, index)}
                                    onRedo={(task, index) => redoHandler(task, index)}
                                />
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </IsLoggedIn>
    );
}