import {TodoList} from "./TodoList";
import {CompletedList} from "./CompletedList";

// TaskList component: Used to display the todo and the completed tasks
export const TaskList = (props) => {
    return (
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
                    onClick={props.onToggleNewTaskWindow}
            >
                Create
            </button>
            <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl absolute left-10 top-5
                                        hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                        px-4 py-3 md:px-5 md:py-4 
                                        `}
                    onClick={props.onOrderTasks}
            >
                Order by {props.order}
            </button>
            <main
                className={`flex flex-col items-center w-[30rem] h-[30rem] md:w-[50rem] md:h-[40rem] overflow-scroll`}>

                <h1 className={`text-2xl md:text-4xl text-gray-700 font-bold mb-4 p-10`}>Your Tasks</h1>
                <div className={`flex`}>
                    <section className={`flex flex-col gap-y-10`}>
                        <TodoList
                            order={props.order}
                            array={props.tasks}
                            onComplete={(task, index) => props.onComplete(task, index)}
                            onDelete={(task, index) => props.onDelete(task, index)}
                        />
                    </section>
                    <section className={`flex flex-col gap-y-10 overflow-y-auto`}>
                        <CompletedList
                            array={props.tasks}
                            onDelete={(task, index) => props.onDelete(task, index)}
                            onRedo={(task, index) => props.onRedo(task, index)}
                        />
                    </section>
                </div>
            </main>
        </div>
    )
}