import {Link, useNavigate} from "react-router-dom";
import { useState} from "react";
import {Input} from "./Input";
import { ref, get, child, push, update } from "firebase/database";
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
                } else if (!isEmail(this.value)) {
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
                } else if (this.value.length < 8) {
                    this.error = 1;
                    console.log("Password is too short");
                    return 0;
                } else if (!hasLetterAndNumber(this.value)) {
                    this.error = 1;
                    console.log("Password does not contain a letter and a number");
                    return 0;
                }
                this.error = 0;
                return 1;
            },
            type: "password",
            label: "Password",
            placeholder: "8+ characters",
        },

        confirmPassword: {
            value: "",
            error: 0,
            validate: function (password) {
                if (this.value === "") {
                    this.error = 1;
                    console.log("Confirm password is empty");
                    return 0;
                } else if(this.value !== password) {
                    console.log("Password", password);
                    console.log("Confirm Password", this.value);
                    this.error = 1;
                    console.log("Passwords do not match");
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

    // Method for password validation
    const hasLetterAndNumber = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        return regex.test(password);
    }

    // Method for email validation
    const isEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // States
    const [submitted, setSubmitted] = useState(0);
    const [passwordType, setPasswordType] = useState("password");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = () => {
        console.log(user);
        setSubmitted(1);
        let allValid = 1;

        // Check if all fields are valid
        Object.keys(user).map((item) => {
            let valid;
            if (item === "confirmPassword") {
                valid = user[item].validate(user.password.value);
            } else {
                valid = user[item].validate();
            }
            console.log("Item valid", item, valid);
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
                        navigate("/log-in");
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
            console.log("Name", name);
            console.log("Value", value);
            console.log("User", user);
            let valid;
            if (name === "confirmPassword") {
                valid = user[name].validate(user.password.value);
            } else {
                valid = user[name].validate();
            }
            console.log(valid);
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
                    error:0,
                }
            }));
        }
        console.log(user);
    }

    // Check if the user exists in the database
    const db = useFirebase();
    const userExists = (email) => {
        console.log("Fetching users");
        let found;
        return get(ref(db, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                found = false;
                Object.entries(data).map((key) => {
                    if (key[1].email === email) {
                        found = true;
                    }
                });
            } else {
                console.log("No data available");
            }
            return found;
        }).catch((error) => {
            console.error(error);
        });
    }

    // Save the user to the database
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
                className={`absolute w-[15rem] md:w-[20rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1]`}></div>
            <div
                className={`absolute w-[10rem] md:w-[15rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1] mt-[17rem] mt:bottom-[10rem]`}></div>

            <section
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'rgba(0, 0, 0, 0.1)'
                }}
                className={`w-[22rem] md:w-[40rem] h-fit flex flex-col justify-center items-center gap-y-10 
                     rounded-xl shadow-2xl p-10`}
            >
                <header className={`flex flex-col items-center`}>
                    <h1 className={`text-3xl md:text-5xl font-bold`}>Sign Up</h1>
                    <h2 className={`text-md md:text-xl text-gray-400`}>Register your account</h2>
                </header>
                <main>
                    <div className={`flex flex-col gap-4`}>
                        {
                            Object.keys(user).map((item, index) => {
                                if (user[item].type === "password" || user[item].type === "confirmPassword") {
                                    return (
                                        <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                               type={passwordType}
                                               label={user[item].label} error={user[item].error}
                                               placeholder={user[item].placeholder}/>
                                    )
                                } else {
                                    return (
                                        <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                               type={user[item].type}
                                               label={user[item].label} error={user[item].error}
                                               placeholder={user[item].placeholder}/>
                                    )
                                }
                            })
                        }
                        <button
                            onClick={() => {
                                if (passwordType === "password") {
                                    setPasswordType("text");
                                } else {
                                    setPasswordType("password");
                                }
                            }}
                            className={`bg-gradient-to-r from-purple-50 to-fuchsia-200 p-2 rounded-md text-gray-400 shadow-2xl`}
                        >
                            {
                                passwordType === "password" ? "Show" : "Hide"
                            } Password
                        </button>
                        <button style={{
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(0, 0, 0, 0.1)'
                        }}
                                onClick={handleSubmit}
                                className={`p-2 rounded-md bg-blue-300 hover:bg-white hover:scale-105 text-white shadow-2xl`}
                        >
                            Sign Up
                        </button>
                        <p className={`flex flex-col items-center sm:gap-0 sm:flex-row`}>Already have an account? <Link
                            to="/log-in" className={`bg-white px-5 py-2 rounded-lg`}>Log
                            in</Link></p>
                    </div>
                </main>
            </section>
        </div>
    );
}