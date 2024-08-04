import {Link, Route, Routes, useRoutes} from "react-router-dom";
import {Login} from "./components/Auth/Login";
import {SignUp} from "./components/Auth/SignUp";
import {Home} from "./components/Home";
import {UserContext} from "./store/user-context";
import {useState} from "react";
import {Todo} from "./components/Todo/Todo";

// Main component: Holds the main logic for the app, the state of the user, and the routes
function App() {
    // Routes
    let routes = useRoutes([
        {
            path: `/`,
            element: <Home/>
        },
        {
            path: `/sign-up`,
            element: <SignUp/>
        },
        {
            path: `/log-in`,
            element: <Login/>
        },
        {
            path: `/to-do`,
            element: <Todo/>
        }
    ]);

    // Value for the context provider
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        tasks: [],
    });

    return (
        <>
            <UserContext.Provider value={user}>
                {routes}
            </UserContext.Provider>
        </>
    );
}

export default App;
