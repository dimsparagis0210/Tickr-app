import {createContext, useContext, useState} from "react";

// UserContext: Context to hold the user data
export const UserContext = createContext({
    id: "",
    name: "",
    email: "",
    password: "",
    tasks: [],
});

// useUserContext hook: Hook to use the UserContext with error handling
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    } return context
}