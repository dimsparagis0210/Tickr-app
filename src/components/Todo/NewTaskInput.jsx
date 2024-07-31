export const NewTaskInput = (props) => {
    const changeHandler = (event) => {
        props.onChange({
            name: props.name,
            value: event.target.value,
        })
    }

    console.log(props.error);
    return (
        <div className={`flex flex-col gap-y-2 p-5`}>
            <label htmlFor={props.name} className={`text-black text-2xl`}>{props.label}</label>
            <input type={props.type} id={`${props.id}`} name={props.name}
                   value={props.value}
                   className={`border border-2 ${props.error ? 'bg-red-300 border-red-500' : 'bg-white border-gray-400'} rounded-md p-2 `}
                   required={true}
                   onChange={changeHandler}
            />
        </div>
    );
}