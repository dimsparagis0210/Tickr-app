import {useRef} from "react";

// NewTaskInput component: Holds the input fields for the new task
export const NewTaskInput = (props) => {
    const inputRef = useRef();
    const changeHandler = (event) => {
        props.onChange({
            name: props.name,
            value: event.target.value,
        })
    }

    return (
        <div className={`flex flex-col gap-y-2 p-2 md:p-5`}>
            <label htmlFor={props.name} className={`text-white text-lg md:text-2xl`}>{props.label}</label>
            <input type={props.type} id={`${props.id}`} name={props.name}
                   value={props.value}
                   className={`border border-2 ${props.error ? 'bg-red-300 border-red-500' : 'bg-white border-gray-400'} rounded-md p-2 `}
                   required={true}
                   ref={inputRef}
                   onChange={changeHandler}
            />
        </div>
    );
}