import {UserContext, useUserContext} from "../../store/user-context";
import {useEffect, useState} from "react";
import {TodoList} from "./TodoList";
import {CompletedList} from "./CompletedList";
import {NewTaskInput} from "./NewTaskInput";
import {colors, inputs, dummy_tasks} from "./data";
import {type} from "@testing-library/user-event/dist/type";

export const Todo = () => {
    //States
    const [taskWindowOpen, setTaskWindowOpen] = useState(false);
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

    //Getting user from local storage
    const user = JSON.parse(localStorage.getItem("d@gmail.com"));
    const [tasks, setTasks] = useState(user.tasks);
    console.log(user);

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
        Object.keys(input).map((item) => {
            if (input[item] === "") {
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
            if (tasks === undefined || tasks.length === 0) {
                setTasks([{
                    name: input.name,
                    description: input.description,
                    deadline: input.deadline,
                    priority: input.priority,
                    status: "todo",
                }])
            } else {
                setTasks((prevState) => {
                    return [
                        ...prevState,
                        {
                            name: input.name,
                            description: input.description,
                            deadline: input.deadline,
                            priority: input.priority,
                            status: "todo",
                        }
                    ]
                });
                const newUser = {
                    ...user,
                    tasks: [
                        ...user.tasks,
                        tasks,
                    ],
                }
                console.log(newUser);
                localStorage.setItem(user.email, JSON.stringify(newUser));
            }
        }
        console.log("Task submitted");
    }

    const completeHandler = (task, index) => {
        console.log("Completed", task);
        setTasks((prevTasks) =>
            prevTasks.map((t, i) => (i === index ? { ...t, task} : t))
        );
    }

    const deleteHandler = (task, index) => {
        console.log("Entered delete handler", task, index);

        setTasks((prevTasks) =>
            prevTasks.filter((t, i) => i !== parseInt(index))
        );
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

    return (
        <div className={`relative min-h-screen flex flex-col items-center justify-center`}>
            <header className={`p-10 flex flex-col items-center`}>
                <h1 className={`text-6xl text-gray-500`}>Welcome back Dimitris</h1>
                <h3 className={`text-2xl text-gray-400`}>Write down your tasks</h3>
            </header>
            <div
                className={`absolute w-[34rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1] mt-[12rem]`}></div>
            <div
                className={`absolute w-[24rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1]  bottom-[5rem]`}>
            </div>
            {
                taskWindowOpen &&
                <div
                    className={`z-10 self-end absolute rounded-xl shadow-xl right-10 bg-gradient-to-tl from-violet-600 to-yellow-300 flex flex-col p-5`}>
                    <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit px-5 py-4 
                                        rounded-xl shadow-xl hover:from-red-100 hover:to-zinc-200 
                                        hover:shadow-2xl w-fit self-end`
                    } onClick={() => setTaskWindowOpen(false)}>
                        Close
                    </button>
                    <header>
                        <h1 className={`text-3xl font-bold text-white p-10`}>Create a new task</h1>
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
                                        key={index}
                                        onChange={({name, value}) => {
                                            handleChange({name, value})
                                        }}
                                    />
                                } else {
                                    return <div className={`flex flex-col gap-y-2 items-start p-5`} key={index}>
                                        <label htmlFor={"priority"} className={`text-black text-2xl`}>Priority</label>
                                        {
                                            Object.keys(colors).map((color, index) => {
                                                return (
                                                    <div className={`flex gap-4`} key={index}>
                                                        <input type={"radio"} id={`radio`} name={"radio"}
                                                               value={color}
                                                               className={`border border-2 ${0 ?
                                                                   'bg-red-300 border-red-500' :
                                                                   'bg-white border-gray-400'} rounded-md p-2 `}
                                                               required={true}
                                                               onClick={() => {
                                                                   setInput((prevState) => ({
                                                                       ...prevState,
                                                                       priority: colors[color],
                                                                   }))
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
                <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit px-5 py-4 
                                    rounded-xl shadow-xl absolute right-10 top-5
                                    hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                    `}
                        onClick={() => {
                            setTaskWindowOpen(true)
                        }}
                >
                    Create
                </button>
                <main className={`flex flex-col items-center w-[50rem] h-[40rem] overflow-scroll`}>

                    <h1 className={`text-4xl text-gray-700 font-bold mb-4 p-10`}>Your Tasks</h1>
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
                            />
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}