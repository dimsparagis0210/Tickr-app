import {colors, inputs} from "../../../data/data";
import {NewTaskInput} from "./NewTaskInput";
import {useEffect, useState} from "react";
import {useUserContext} from "../../../store/user-context";

// NewTaskWindow component: Holds the logic of the new Task window, the state of the inputs,
// and the methods to handle the inputs
export const NewTaskWindow = (props) => {
    // States
    const [error, setError] = useState({
        name: 0,
        description: 0,
        deadline: 0,
    });
    const [submitted, setSubmitted] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState(null);
    const [radio, setRadio] = useState({
        high: false,
        medium: false,
        low: false,
    });
    const context = useUserContext();

    // Effects
    useEffect(() => {
        if (submitted) {
            setSelectedRadio(null); // Clear the selected option
            setSubmitted(false); // Reset submitted flag
        }
    }, [submitted])

    // Methods
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
        props.onChangeInput({name, value});
    }

    const setTime = () => {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad with leading zero if needed
        const formattedTime = `${now.getHours()}:${minutes}`;
        return formattedTime;
    }

    //Function for the task submission
    const submitTask = () => {
        let areAllValid = 1;
        setSubmitted(true);
        const newTask = {
            key: "",
            name: props.input.name,
            description: props.input.description,
            deadline: props.input.deadline,
            priority: props.input.priority,
            status: "todo",
            date: `${new Date()}`,
            startTime: setTime(),
        }
        Object.keys(props.input).map((item) => {
            if (props.input[item] === "" && item !== "description") {
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
            props.onSaveTask(newTask);
        }
        console.log("Task submitted");
    }
    return (
            props.taskWindowOpen &&
                <>
                    <div
                        className={`z-10 self-end absolute rounded-t-xl
                                    shadow-2xl bg-gradient-to-tl from-violet-600 to-yellow-300 flex flex-col p-5
                                    bottom-0 h-1/2 overflow-scroll w-full                                                                
                                    lg:right-10 lg:w-auto lg:overflow-auto lg:h-fit md:rounded-xl lg:bottom-auto
                         
                         `}
                        style={{
                            boxShadow: 'inset 0px 0px 0px 6px rgba(255,255,255,0.6)',
                        }}
                    >
                        <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                            rounded-xl shadow-xl hover:from-red-100 hover:to-zinc-200 
                                            hover:shadow-2xl w-fit self-end
                                            px-3 py-3 md:px-5 md:py-4 `
                        } onClick={props.onToggle}>
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
                                            value={props.input[item]}
                                            key={index}
                                            onChange={({name, value}) => {
                                                handleChange({name, value})
                                            }}
                                        />
                                    } else {
                                        return <div className={`flex flex-col gap-y-2 items-start p-2 md:p-5`}
                                                    key={index}>
                                            <label htmlFor={"priority"}
                                                   className={`text-white text-lg md:text-2xl`}>Priority</label>
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
                                                                       props.onChangePriority(colors[color]);
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
                </>
    )
}