import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {Input} from "./Input";
import {useUserContext} from "../../store/user-context";
import {useFirebase} from "../../hooks/useFirebase";
import {get, ref} from "firebase/database";

export const Login = () => {
    const context = useUserContext();
    const [passwordType, setPasswordType] = useState("password");
    // User input state
    const [user, setUser] = useState({
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
                } else if (!hasLetterAndNumber(this.value)) {
                    this.error = 1;
                    return 0;
                } else if (this.value.length < 8) {
                    this.error = 1;
                    console.log("Password is too short");
                    return 0;
                }
                this.error = 0;
                return 1;
            },
            type: "password",
            label: "Password",
            placeholder: "8+ characters",
        },
    });

    // States
    const [submitted, setSubmitted] = useState(0);

    const navigate = useNavigate();

    // Function to check if the password has a letter and a number
    const hasLetterAndNumber = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        return regex.test(password);
    }

    // Function to check if the email is valid
    const isEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to handle the form submission
    const handleSubmit = () => {
        setSubmitted(1);
        let allFieldsValid = 1;

        //Mapping through the user object to validate each field
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
                allFieldsValid = 0;
            }
        });
        const finalUser = {
            email: user.email.value,
            password: user.password.value,
        }
        if(allFieldsValid) {
            userExists(finalUser.email).then((exists) => {
                if (exists) {
                    if (finalUser.password !== context.password) {
                        alert("Incorrect password");
                        return;
                    } else {
                        localStorage.setItem(finalUser.email, JSON.stringify(context));
                        navigate("/to-do");
                    }
                } else {
                    alert("User does not exist");
                }
            });
        }
    }

    // Hook to get the firebase database
    const db = useFirebase();

    // Function to check if the user exists in the database
    const userExists = (email) => {
        let found;
        return get(ref(db, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                found = false;
                Object.keys(data).map((user) => {
                    const currentEmail = data[user].email;
                    if (currentEmail === email) {
                        console.log("Found user");
                        found = true;
                        context.id = user;
                        context.name = data[user].username;
                        context.email =  data[user].email;
                        context.password =  data[user].password;
                        context.tasks =  data[user].tasks || [];
                        console.log(context);
                    }
                })
            } else {
                console.log("No data available");
            }
            return found;
        }).catch((error) => {
            console.error(error);
        });
    }

    // Function to handle the change in the input fields
    const handleChange = ({name, value}) => {
        // If the form has been submitted, validate the input fields
        // Else just update the value
        if (submitted) {
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
    }

    return (
        <div className={`relative min-h-screen flex items-center justify-center overflow-hidden`}>
            <div
                className={`absolute w-[15rem] md:w-[20rem] aspect-square rounded-full bg-purple-400 opacity-10 z-[-1]`}></div>
            <div
                className={`absolute w-[10rem] md:w-[15rem] aspect-square rounded-full bg-pink-400 opacity-10 z-[-1] mt-[10rem]`}></div>

            <section
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'rgba(0, 0, 0, 0.1)'
                }}
                className={`w-[25rem] md:w-[40rem] h-fit flex flex-col justify-center items-center gap-y-10 
                     rounded-xl shadow-2xl p-10`}
            >
                <header className={`flex flex-col items-center`}>
                    <h1 className={`text-3xl md:text-5xl font-bold`}>Log in</h1>
                    <h2 className={`text-md md:text-xl text-gray-400`}>Enter your credentials</h2>
                </header>
                <main>
                    <div className={`flex flex-col gap-4`}>
                        {
                            Object.keys(user).map((item, index) => {
                                if (user[item].type === "password") {
                                    return (
                                        <>
                                            <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                                   type={passwordType}
                                                   label={user[item].label} error={user[item].error} placeholder={user[item].placeholder}
                                            />
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
                                        </>
                                    )
                                } else {
                                    return (
                                        <Input key={index} onChange={({name, value}) => handleChange({name, value})}
                                               type={user[item].type}
                                               label={user[item].label} error={user[item].error} placeholder={user[item].placeholder}
                                        />
                                    )
                                }
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