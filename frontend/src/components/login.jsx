import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router'
import toast from "react-hot-toast"

function Login() {

    const navigate = useNavigate()

    const [login, setLogin] = useState(true)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleLogin = () => {
        setLogin(!login)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if(login){
            // login
            try{
                const res = await axios.post("/api/user/login", {email, password}, {withCredentials: true} )
                if(res?.data?.success){
                    localStorage.setItem("token", res?.data?.token);
                    toast.success(res?.data?.msg)
                    navigate("/")
                }
            } catch(err){
                console.log("error while login in frontend: ", err);
                toast.error(
                    err?.response?.data?.msg || 
                    err?.message || 
                    "Something went wrong"
                )
            }
        } else{
            // sign up
            try{
                const res = await axios.post("/api/user/signup", {name, email, password}, {withCredentials: true})
                if(res?.data?.success){
                    toast.success(res?.data?.msg)
                    setLogin(true)
                }
            } catch(err){
                console.log("error while signup in frontend: ", err);
                toast.error(
                    err?.response?.data?.msg || 
                    err?.message || 
                    "Something went wrong"
                )
            }
        }

    }


  return (
    <div className='h-screen w-screen bg-black text-whit flex gap-3 items-center justify-between text-white selection:text-black absolute -z-4 selection:bg-white'>

        


        <div>
            <img src="/dither.jpg" className=' w-screen h-screen rounded-2x absolute top-0 left-0  -z-2 object-cover mask-r-from-10% mask-r-to-100%' />

         
        </div>


        <div className='pl-12'>
            
            <div className=' px-10  w-200 h-150 rounded-2xl text-white flex mt-20 items-center flex-col'>

                <h1 className='font-gothic text-[50px] mb-10'>{login ? "Login" : "Sign Up"}</h1>

    
                <form onSubmit={submitHandler} >
                    {
                        !login ? (
                            <div className=" relative border-2 border-neutral-700/80 focus-within:border-neutral-300 bg-neutral-900/70 backdrop-blur-xs  w-120 rounded-xl h-13 mb-5">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            className="  absolute text-white outline-none border-none border-2 mb-10 rounded-xl w-120 h-12 placeholder:text-neutral-600 font-poppins font-semibold px-4 text-lg "
                        />
                            </div>
                        ) : (
                            <div></div>
                        )
                    }


                    <div className=" relative border-2 border-neutral-700/80 focus-within:border-neutral-300 bg-neutral-900/70 backdrop-blur-xs w-120 rounded-xl h-13 mb-5">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                            maxLength={100}
                            className="  absolute text-white outline-none border-none border-2 mb-10 rounded-xl w-120 h-12 placeholder:text-neutral-600 font-poppins font-semibold px-4 text-lg "
                        />
                    </div>


                    <div className=" relative border-2 border-neutral-700/80 backdrop-blur-xs focus-within:border-neutral-300 bg-neutral-900/70  w-120 rounded-xl h-13 mb-5">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="text"
                            required
                            minLength={login ? undefined : 3}
                            maxLength={72}
                            className="absolute text-white outline-none border-none border-2 mb-10 rounded-xl w-120 h-12 placeholder:text-neutral-600 font-poppins font-semibold px-4 text-lg "
                        />
                    </div>


                    <button type="submit" className='rounded-xl w-120 mt-2 h-13 bg-white text-black justify-center flex items-center font-poppins font-semibold
                    text-lg cursor-pointer active:scale-99 transition-all duration-100'>
                        {login ? "Login" : "Sign Up"}
                    </button>

                    <p className='text-neutral-400 mt-3 flex justify-start w-120 '>{!login ? "Already have an account?" : "Do not have an account?"}<span onClick={handleLogin} className='font-semibold ml-1 text-white cursor-pointer'>{!login ? "Login" : "Sign Up"}</span></p>


                </form>

                

            </div>
        </div>


    </div>
  )
}

export default Login



