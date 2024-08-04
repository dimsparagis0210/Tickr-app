import {useUserContext} from "../store/user-context";

// useLoggedInUser hook: Custom hook to get the logged-in user from the local storage
export const useLoggedInUser = () => {
    const context = useUserContext();
    const user = localStorage.getItem(context.email);

    return user;
}