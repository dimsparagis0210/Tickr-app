import {Link} from "react-router-dom";

// Home component: This component is responsible for rendering the home page
export const Home = () => {
    return(
        <div className={`min-h-screen relative w-full flex justify-center items-center flex-col gap-y-10 
        bg-white`}>
            <div className={`w-[20rem] h-[20rem] md:w-[40rem] md:h-[30rem] flex justify-center items-center flex-col gap-y-10 
            text-gray-600 rounded-xl shadow-2xl bg-gradient-to-r from-purple-50 to-fuchsia-100`}
                 style={{
                     backdropFilter:'blur(10px)',
                }}
            >
                <div className={`object-cover`}>
                    <img src="Tickr.png" alt="Tickr" className={`p-1 ob`}/>
                </div>
                <header className={`flex flex-col items-center`}>
                    <h1 className={`text-2xl md:text-5xl font-bold`}>Productivity at its peak</h1>
                    <h2 className={`text-lg md:text-2xl`}>Start tracking your tasks</h2>
                </header>
                <main className={`flex gap-4`}>
                    <Link to={`/log-in`} className={`bg-blue-300 p-5 rounded-xl`} style={{
                        backdropFilter:'blur(10px)',
                        background:'rgba(0, 0, 0, 0.1)'
                    }}>Log in</Link>
                    <Link to={`/sign-up`} className={`bg-blue-300 p-5 rounded-xl hover:bg-white hover:scale-100`} style={{
                        backdropFilter:'blur(10px)',
                        background:'rgba(0, 0, 0, 0.1)',
                    }}>Sign up</Link>
                </main>
            </div>
        </div>
    );
}