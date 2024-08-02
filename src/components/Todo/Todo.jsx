import {UserContext, useUserContext} from "../../store/user-context";
import {useEffect, useRef, useState} from "react";
import {TodoList} from "./TodoList";
import {CompletedList} from "./CompletedList";
import {NewTaskInput} from "./NewTaskInput";
import {colors, inputs} from "../../data/data";
import {useNavigate} from "react-router-dom";
import {useFirebase} from "../../hooks/useFirebase";
import {push, ref, update} from "firebase/database";

export const Todo = () => {
    //States
    const [taskWindowOpen, setTaskWindowOpen] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState(null);
    const navigate = useNavigate();
    const [radio, setRadio] = useState({
        high: false,
        medium: false,
        low: false,
    });
    const db = useFirebase();
    const context = useUserContext();
    const [submitted, setSubmitted] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        deadline: "",
        priority: "",
    });
    const [error, setError] = useState({
        name: 0,
        description: 0,
        deadline: 0,
    });

    useEffect(() => {
        if (submitted) {
            setSelectedRadio(null); // Clear the selected option
            setSubmitted(false); // Reset submitted flag
        }
    }, [submitted])

    //Getting user from local storage
    const user = JSON.parse(localStorage.getItem(context.email));
    console.log("User", user);
    let objectTasks = [];
    Object.keys(user.tasks).map((item) => {
        objectTasks.push(
            {
                id: user.tasks,
                deadline: user.tasks[item].deadline,
                description: user.tasks[item].description,
                key: user.tasks[item].key,
                name: user.tasks[item].name,
                priority: user.tasks[item].priority,
                startTime: user.tasks[item].startTime,
                status: user.tasks[item].status,
            }
        );
    });
    console.log("Tasks", objectTasks);
    const [tasks, setTasks] = useState(objectTasks);

    useEffect(() => {
        const newUser = {
            ...user,
            tasks: tasks,
        }
        localStorage.setItem(user.email, JSON.stringify(newUser));
    }, [tasks])

    //Function for the task submission
    const submitTask = () => {
        let areAllValid = 1;
        setSubmitted(true);
        const newTask = {
            key: "",
            name: input.name,
            description: input.description,
            deadline: input.deadline,
            priority: input.priority,
            status: "todo",
            startTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        }
        Object.keys(input).map((item) => {
            if (input[item] === "" && item !== "description") {
                setInput((prevState) => {
                    return {
                        ...prevState,
                        error: 1,
                    }
                })
                setError((prevState) => {
                    return {
                        ...prevState,
                        [item]: 1,
                    }
                })
                areAllValid = 0;
            }
        });
        if (!areAllValid) {
            console.log("Please fill in all the fields");
        } else {
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
                setRadio(false);
            });
        }
        console.log("Task submitted");
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

    const handleChange = ({name, value}) => {
        if (value === "") {
            console.log(`Please fill in the ${name} field`);
            setError((prevState) => {
                return (
                    {
                        ...prevState,
                        [name]: 1,
                    }
                )
            });
        } else {
            setError((prevState) => {
                return {
                    ...prevState,
                    [name]: 0,
                }
            })

        }
        setInput((prevState) => {
            return (
                {
                    ...prevState,
                    [name]: value,
                }
            )
        });
    }

    const logOutHandler = () => {
        localStorage.removeItem(context.email);
        console.log("Logged out");
        navigate("/log-in");
    }

    return (
        <div className={`relative min-h-screen flex flex-col items-center justify-center`}>
            <header className={`p-10 flex flex-col items-center`}>
                <h1 className={`text-4xl md:text-6xl text-gray-500`}>Welcome back Dimitris</h1>
                <h3 className={`text-xl md:text-2xl text-gray-400`}>Write down your tasks</h3>
            </header>
            <button className={`absolute  bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl hover:from-red-100 hover:to-zinc-200 
                                        hover:shadow-2xl w-fit text-sm md:text-md
                                        px-4 py-3 md:px-5 md:py-4 
                                        top-5 left-5 md:top-10 md:left-10
                              `}
                    onClick={logOutHandler}
            >
                Log Out
            </button>
            <div
                className={`absolute w-[24rem] md:w-[34rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1] mt-[12rem]`}></div>
            <div
                className={`absolute w-[14rem] md:w-[24rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1] mt-[21rem]`}>
            </div>
            {
                taskWindowOpen &&
                <div
                    className={`z-10 self-end absolute rounded-xl shadow-2xl right-10 bg-gradient-to-tl from-violet-600 to-yellow-300 flex flex-col p-5`}
                    style={{
                        boxShadow: 'inset 0px 0px 0px 6px rgba(255,255,255,0.6)',
                    }}
                >
                    <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl hover:from-red-100 hover:to-zinc-200 
                                        hover:shadow-2xl w-fit self-end
                                        px-3 py-3 md:px-5 md:py-4 `
                    } onClick={() => setTaskWindowOpen(false)}>
                        Close
                    </button>
                    <header>
                        <h1 className={`text-xl md:text-3xl text-white p-10`}>Create a new task</h1>
                    </header>
                    <main>
                        {
                            Object.keys(inputs).map((item, index) => {
                                if (inputs[item].type !== "radio") {
                                    return <NewTaskInput
                                        id={inputs[item].id}
                                        name={inputs[item].name}
                                        type={inputs[item].type}
                                        label={inputs[item].label}
                                        placeholder={inputs[item].placeholder}
                                        error={error[item]}
                                        value={input[item]}
                                        key={index}
                                        onChange={({name, value}) => {
                                            handleChange({name, value})
                                        }}
                                    />
                                } else {
                                    return <div className={`flex flex-col gap-y-2 items-start p-2 md:p-5`} key={index}>
                                        <label htmlFor={"priority"} className={`text-white text-lg md:text-2xl`}>Priority</label>
                                        {
                                            Object.keys(colors).map((color, index) => {
                                                return (
                                                    <div className={`flex gap-4 text-${colors[index]}`} key={index}>
                                                        <input type={"radio"} id={`radio`} name={"radio"}
                                                               value={color}
                                                               checked={selectedRadio === color}
                                                               className={`radioBtn border border-2 ${0 ?
                                                                   'bg-red-300 border-red-500' :
                                                                   'bg-white border-gray-400'} rounded-md p-2`}
                                                               required={true}
                                                               onClick={() => {
                                                                   setInput((prevState) => ({
                                                                       ...prevState,
                                                                       priority: colors[color],
                                                                   }))
                                                               }}
                                                               onChange={() => {
                                                                     setSelectedRadio(color);
                                                               }}
                                                        />
                                                        <label htmlFor="name">{color}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            })
                        }
                    </main>
                    <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit px-5 py-4 
                                        rounded-xl shadow-xl hover:from-red-100 hover:to-zinc-200 
                                        hover:shadow-2xl`}
                            onClick={submitTask}
                    >
                        Submit
                    </button>
                </div>
            }
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
                <main className={`flex flex-col items-center w-[30rem] h-[30rem] md:w-[50rem] md:h-[40rem] overflow-scroll`}>

                    <h1 className={`text-2xl md:text-4xl text-gray-700 font-bold mb-4 p-10`}>Your Tasks</h1>
                    <div className={`flex`}>
                        <section className={`flex flex-col gap-y-10`}>
                            <TodoList
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
    );
}