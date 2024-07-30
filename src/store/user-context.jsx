import {createContext, useContext, useState} from "react";

export const UserContext = createContext({
    name: "",
    email: "",
    password: "",
    tasks: [],

});

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    } return context
}