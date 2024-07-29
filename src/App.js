import {Link, Route, Routes, useRoutes} from "react-router-dom";
import {Login} from "./components/Auth/Login";
import {SignUp} from "./components/Auth/SignUp";
import {Home} from "./components/Home";


function App() {
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
        }
    ])
    return (
        <>
            {routes}
        </>
    );
}

export default App;
