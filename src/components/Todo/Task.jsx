import {useState} from "react";

export const Task = (props) => {
    const [hover, setHover] = useState(false);

    const calculateDeadline = () => {
        const deadline = props.deadline.split(":");
        const deadlineHours = parseInt(deadline[0]);
        const deadlineMinutes = parseInt(deadline[1]);

        console.log(deadlineHours, deadlineMinutes);
        console.log(props.currentTime.split(":"));

        //deadline + startTime - currentTime
        const startTime = props.startTime.split(":");
        const time = props.currentTime.split(":");
        const currentHours = parseInt(time[0]);
        const currentMinutes = parseInt(time[1]);

        console.log("Current time: ", currentHours, currentMinutes);
        console.log("Start time: ", startTime);
        console.log("Deadline: ", deadline);
        console.log("Remaining hours: ", deadlineHours + props.startTime.split(":")[0] - currentHours);
        console.log("Remaining minutes: ", deadlineMinutes + parseInt(props.startTime.split(":")[1]) - currentMinutes);
        const remainingHours = deadlineHours + parseInt(props.startTime.split(":")[0]) - currentHours;
        const remainingMinutes = deadlineMinutes + parseInt(props.startTime.split(":")[1]) - currentMinutes;
        const remainingTime = `${remainingHours}h:${remainingMinutes}min`;

        return remainingTime;
    }

    return (
        <div className={`relative flex flex-col px-10 py-3 h-fit bg-white rounded-xl gap-y-10 hover:cursor-pointer`}
             style={{
                 boxShadow: `15px 0px 0px -5px ${props.priority} inset`
             }}
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
        >

            <header className={`flex justify-between`}>
                <section className={``}>
                    <h2 className={`self-start text-3xl`}>{props.name}</h2>
                    <p className={`text-gray-400`}>{props.notes}</p>
                </section>
                <section className={`flex flex-col gap-y-2`}>
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
                    <button className={`p-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600
                        text-white shadow-xl hover:text-white`}
                            onClick={() => {
                                console.log("Completed");
                                props.onDelete();
                            }}
                    >
                        Delete
                    </button>
                </section>

            </header>
            <section className={`flex gap-10`}>
                <p className={`self-end`}>Started at <span
                    className={`font-bold text-xl`}>{props.startTime}</span></p>
                <p className={`self-end`}>Available time <span className={`text-2xl`}>{props.deadline}</span></p>
            </section>
        </div>
    );
}