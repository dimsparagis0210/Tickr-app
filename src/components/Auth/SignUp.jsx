import {Link, Navigate, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Input} from "./Input";
import {initializeApp} from "firebase/app";
import { getDatabase, ref, set, get, child, push, update } from "firebase/database";
import {useFirebase} from "../../hooks/useFirebase";


export const SignUp = () => {
    // User input state
    const [user, setUser] = useState({
        name: {
            value: "",
            error: 0,
            validate: function () {
                if (this.value === "") {
                    this.error = 1;
                    console.log("Name is empty");
                    return 0;
                } else {
                    this.error = 0;
                    return 1;
                }
            },
            type: "name",
            label: "Name",
            placeholder: "Dimitris Sparagis",
        },
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

        confirmPassword: {
            value: "",
            error: 0,
            validate: function () {
                if (this.value === "") {
                    this.error = 1;
                    console.log("Confirm password is empty");
                    return 0;
                } else {
                    this.error = 0;
                    return 1;
                }
            },
            type: "password",
            label: "Confirm Password",
            placeholder: "5+ characters",
        },
    });

    const [submitted, setSubmitted] = useState(0);

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = () => {
        console.log(user);
        setSubmitted(1);
        let allValid = 1;

        // Check if all fields are valid
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

        // If all fields are valid, create user object, save to database and local storage and navigate to todo page
        if (allValid) {
            console.log("All valid");
            const finalUser = {
                name: user.name.value,
                email: user.email.value,
                password: user.password.value,
                tasks: [],
            }
            console.log("User exists",userExists(finalUser.email));
            // saveUser(finalUser);
            userExists(finalUser.email).then((exists) => {
                if (exists) {
                    alert("User already exists");
                } else {
                    localStorage.setItem(finalUser.email, JSON.stringify(finalUser));
                    saveUser(finalUser).then(() => {
                        navigate("/");
                    });
                }
            });
        }
    }

    // Handle input change
    const handleChange = ({name, value}) => {

        // If the form has been submitted, validate the input fields
        // Else just update the value
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

    const db = useFirebase();

    const userExists = (email) => {
        console.log("Fetching users");
        let found;
        return get(ref(db, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Snapshot", snapshot.val());
                const data = snapshot.val();
                found = false;
                data.map((user) => {
                    console.log(user);
                    console.log(user.email);
                    console.log(email);
                    console.log(user.email === email);
                    if (user.email === email) {
                        found = true;
                    }
                })
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
            console.log("Found", found);
            return found;
        }).catch((error) => {
            console.error(error);
        });
    }

    const saveUser = (user) => {
        const newUserKey = push(child(ref(db), 'users')).key;
        const updates = {};
        const newUserPost = {
            username: user.name,
            email: user.email,
            password: user.password,
            tasks: [],
        }
        updates[`/users/${newUserKey}`] =  newUserPost;

        return update(ref(db), updates);
    }

    return (
        <div className={`relative min-h-screen flex items-center justify-center overflow-hidden`}>
            <div
                className={`absolute w-[20rem] lg:w-[30rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1]`}></div>
            <div
                className={`absolute w-[10rem] lg:w-[20rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1] bottom-[17rem] lg:bottom-[10rem]`}></div>

            <section
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'rgba(0, 0, 0, 0.1)'
                }}
                className={`w-[30rem] lg:w-[40rem] h-fit flex flex-col justify-center items-center gap-y-10 
                     rounded-xl shadow-2xl p-10`}
            >
                <header className={`flex flex-col items-center`}>
                    <h1 className={`text-5xl font-bold`}>Sign Up</h1>
                    <h2 className={`text-xl text-gray-400`}>Register your account</h2>
                </header>
                <main>
                    <div className={`flex flex-col gap-4`}>
                        {
                            Object.keys(user).map((item, index) => {
                                return (
                                    <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                           type={user[item].type}
                                           label={user[item].label} error={user[item].error}
                                           placeholder={item.placeholder}/>
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
                            Sign Up
                        </button>
                        <p>Already have an account? <Link to="/log-in" className={`bg-white px-5 py-2 rounded-lg`}>Log
                            in</Link></p>
                    </div>
                </main>
            </section>
        </div>
    );
}