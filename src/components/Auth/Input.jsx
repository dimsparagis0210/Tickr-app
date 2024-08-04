export const Input = (props) => {
    let id;

    if(props.label === 'Confirm Password') {
        id = 'confirmPassword';
    } else {
        id = props.type;
    }

    const handleChange = (e) => {
        if (props.label === 'Confirm Password') {
            props.onChange({name: 'confirmPassword', value: e.target.value});
        } else {
            props.onChange({name: e.target.name, value: e.target.value});
        }
    }

    return (
        <div className={`flex flex-col gap-y-2`}>
            <label htmlFor={props.type} className={`text-gray-400`}>{props.label}</label>
            <input type={props.type} id={id} name={props.type}
                   className={`border border-2 ${props.error ? 'bg-red-300 border-red-500' : 'bg-white border-gray-400'} rounded-md p-2 `}
                   onChange={handleChange} required={true} placeholder={props.placeholder}
            />
        </div>
    )
}