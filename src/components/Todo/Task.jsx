import {useState} from "react";

export const Task = (props) => {
    const [hover, setHover] = useState(false);
    return (
        <div className={`relative flex flex-col px-10 py-3 h-fit bg-white rounded-xl gap-y-10 hover:cursor-pointer`}
             style={{
                 boxShadow: `15px 0px 0px -5px ${props.priority} inset`
             }}
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
             onClick={() => {
                 console.log("Delete");
                 props.onDelete();
             }}
        >
            <label htmlFor="" className={`absolute self-center ${hover ? 'visible' : 'hidden'} 
                                          w-[2rem] aspect-square hover:cursor-pointer`}
            >
                <img src="delete_btn.png" alt="Delete"/>
            </label>
            <header className={`flex justify-between`}>
                <section className={``}>
                    <h2 className={`self-start text-3xl`}>{props.name}</h2>
                    <p className={`text-gray-400`}>{props.notes}</p>
                </section>
                <button className={`p-4 rounded-xl text-gray-400 shadow-xl hover:text-white`} style={{
                    background: "rgba(0, 0, 0, 0.1)",
                    backdropFilter: `blur(10px)`,
                }}
                        onClick={() => {
                            console.log("Completed");
                            props.onComplete();
                        }}
                >
                    Complete
                </button>
            </header>
            <section className={`flex gap-10`}>
                <p className={`self-end`}>Started at <span
                    className={`font-bold text-xl`}>{props.time}</span></p>
                <p className={`self-end`}>Available time <span className={`text-2xl`}>{props.currentTime}</span></p>
            </section>
        </div>
    );
}