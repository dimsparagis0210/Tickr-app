// Background component: Holds the background elements of the todo list
export const Background = () => {
    return (
        <>
            <div
                className={`absolute w-[24rem] md:w-[34rem] aspect-square 
                rounded-full bg-purple-400 opacity-10 z-[-1] mt-[12rem]`}
            />
            <div
                className={`absolute w-[14rem] md:w-[24rem] aspect-square rounded-full 
                bg-pink-400 opacity-10 z-[-1] mt-[21rem]`}
            />
        </>
    )
}