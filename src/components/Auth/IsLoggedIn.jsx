import {useEffect, useState} from "react";
import {useUserContext} from "../../store/user-context";
import {useNavigate} from "react-router-dom";

export const IsLoggedIn = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const context = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (context.email !== "") {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        isLoggedIn
            ?
                children
            :
                <div className={`flex flex-col gap-y-10 justify-center items-center h-screen bg-gradient-to-r from-slate-50 to-zinc-300`}>
                    <h1 className={`text-black text-xl sm:text-2xl lg:text-5xl font-bold`}>You need to be logged in to view this page</h1>
                    <button
                        onClick={() => navigate('/log-in')}
                        className={`text-2xl bg-blue-500 text-white px-7 py-6 rounded-xl hover:text-black shadow-2xl`}
                        style={{
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Log In
                    </button>
                </div>
    )

}