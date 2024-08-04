import {useUserContext} from "../../store/user-context";
import {useNavigate} from "react-router-dom";

// Header component: Holds the header of the todo list
export const Header = (props) => {
    const context = useUserContext();
    const navigate = useNavigate();

    // Method to log out the user
    const logOutHandler = () => {
        localStorage.removeItem(context.email);
        console.log("Logged out");
        navigate("/log-in");
    }

    return (
        <>
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
        </>
    );
}