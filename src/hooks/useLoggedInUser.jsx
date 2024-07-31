import {useUserContext} from "../store/user-context";

export const useLoggedInUser = () => {
    const context = useUserContext();
    const user = localStorage.getItem(context.email);

    return user;
}