import {Link, Navigate, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Input} from "./Input";
import {useUserContext} from "../../store/user-context";

export const Login = () => {
    const context = useUserContext();
    const [user, setUser] = useState({
        email: {
            value: "",
            error: 0,
            validate: function () {
                if (this.value === "") {
                    this.error = 1;
                    console.log("Email is empty");
                    return 0;
                } else if (!this.value.includes("@")) {
                    this.error = 1;
                    console.log("Email is invalid");
                    return 0;
                } else {
                    this.error = 0;
                    return 1;
                }
            },
            type: "email",
            label: "Email",
            placeholder: "d@gmail.com",
        },
        password: {
            value: "",
            error: 0,
            validate: function () {
                if (this.value === "") {
                    this.error = 1;
                    console.log("Password is empty");
                    return 0;
                } else {
                    this.error = 0;
                    return 1;
                }
            },
            type: "password",
            label: "Password",
            placeholder: "5+ characters",
        },
    });

    const [submitted, setSubmitted] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(user);
        setSubmitted(1);
        let allValid = 1;
        Object.keys(user).map((item) => {
            const valid = user[item].validate();
            if (!valid) {
                setUser((prevState) => ({
                    ...prevState,
                    [item]: {
                        ...prevState[item],
                        error: 1,
                    }
                }));
                allValid = 0;
            }
        });
        const localUser = JSON.parse(localStorage.getItem(user.email.value));
        console.log("Local", localUser);
        const finalUser = {
            email: user.email.value,
            password: user.password.value,
        }
        console.log("Final", finalUser);
        const emailExists = localUser.email === finalUser.email;
        const passwordExists = localUser.password === finalUser.password;
        console.log(emailExists, passwordExists);
        const userExists = emailExists && passwordExists;

        if (userExists) {
            console.log("User exists");
            context.name = localUser.name;
            context.email = localUser.email;
            context.password = localUser.password;
            navigate("/to-do");

        } else {
            console.log("User does not exist");
        }
    }

    const handleChange = ({name, value}) => {

        if (submitted) {
            console.log("submitted");
            console.log(user[name].validate(value));
            console.log("Value", value);
            const valid = user[name].validate(value);
            setUser((prevState) => ({
                ...prevState,
                [name]: {
                    ...prevState[name],
                    value: value,
                    error: !valid,
                }
            }));


        } else {
            setUser((prevState) => ({
                ...prevState,
                [name]: {
                    ...prevState[name],
                    value: value,
                }
            }));
        }
        console.log(user);
    }

    return (
        <div className={`relative min-h-screen flex items-center justify-center overflow-hidden`}>
            <div
                className={`absolute w-[20rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1]`}></div>
            <div
                className={`absolute w-[15rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1]  bottom-[15rem]`}></div>

            <section
                style={{
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(0, 0, 0, 0.1)'
                }}
                className={`w-[40rem] h-fit flex flex-col justify-center items-center gap-y-10 
                     rounded-xl shadow-2xl p-10`}
            >
                <header className={`flex flex-col items-center`}>
                    <h1 className={`text-5xl font-bold`}>Log in</h1>
                    <h2 className={`text-xl text-gray-400`}>Enter your credentials</h2>
                </header>
                <main>
                    <div className={`flex flex-col gap-4`}>
                        {
                            Object.keys(user).map((item, index) => {
                                return (
                                    <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                           type={user[item].type}
                                           label={user[item].label} error={user[item].error} placeholder={item.placeholder}/>
                                )
                            })
                        }
                        <button style={{
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(0, 0, 0, 0.1)'
                        }}
                                onClick={handleSubmit}
                                className={`p-2 rounded-md bg-blue-300 hover:bg-white hover:scale-105 text-white shadow-2xl`}
                        >
                            Sign in
                        </button>
                        <p>Don't have an account? <Link to="/sign-up" className={`bg-white px-5 py-2 rounded-lg`}>Sign up</Link></p>
                    </div>
                </main>
            </section>
        </div>
    );
}