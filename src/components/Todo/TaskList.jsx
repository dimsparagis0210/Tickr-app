import {TodoList} from "./TodoList";
import {CompletedList} from "./CompletedList";

// TaskList component: Used to display the todo and the completed tasks
export const TaskList = (props) => {
    return (
        <div className={`relative flex flex-col items-center rounded-xl shadow-2xl`}
             style={{
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
                 background: 'rgba(0, 0, 0, 0.1)'
             }}
        >
            <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl absolute right-3 sm:right-10 top-5
                                        hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                        px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 
                                        text-sm sm:text-md lg:text-lg
                                        `}
                    onClick={props.onToggleNewTaskWindow}
            >
                Create
            </button>
            <button className={`bg-gradient-to-r from-red-50 to-zinc-100 h-fit 
                                        rounded-xl shadow-xl absolute left-3 sm:left-10 top-5
                                        hover:from-red-100 hover:to-zinc-200 hover:shadow-2xl
                                        px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 
                                        text-sm sm:text-md lg:text-lg
                                        `}
                    onClick={props.onOrderTasks}
            >
                Order by {props.order}
            </button>
            <main
                className={`flex flex-col items-center w-[25rem] h-[25rem] sm:w-[30rem] sm:h-[30rem] lg:w-[50rem] lg:h-[40rem] overflow-scroll`}>

                <h1 className={`text-2xl lg:text-4xl text-gray-700 font-bold mb-4 p-10`}>Your Tasks</h1>
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