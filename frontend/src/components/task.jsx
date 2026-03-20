import React, { useState, useEffect } from 'react'
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import axios from 'axios';
import toast from 'react-hot-toast';

function Task() {


    const [sidebar, setSidebar] = useState(false);

    const handleSidebar = () => {
    setSidebar(!sidebar);
    };
    

    const [todo, setTodo] = useState("")
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem("token")
    }

    // Fetch all todos on mount
    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try{
            setLoading(true)
            const token = getToken()
            if(!token){
                toast.error("Please login first")
                return
            }
            const res = await axios.get("/api/todo/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            if(res?.data?.success){
                setTodos(res?.data?.todos || [])
            }
        } catch(err){
            console.log("error fetching todos: ", err);
            toast.error(err?.response?.data?.msg || "Error fetching todos")
        } finally{
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!todo.trim()){
            toast.error("Todo cannot be empty")
            return
        }

        try{
            const token = getToken()
            if(!token){
                toast.error("Please login first")
                return
            }
            const res = await axios.post("/api/todo/add", {text: todo}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            if(res?.data?.success){
                toast.success(res?.data?.msg)
                setTodo("")
                setTodos([...todos, res?.data?.todo])
            }
        } catch(err){
            console.log("error while creating task in frontend: ", err);
            toast.error(err?.response?.data?.msg || "Error creating todo")
        }
    }

    const handleToggleTodo = async (todoId, completed) => {
        try{
            const token = getToken()
            const res = await axios.put(`/api/todo/update/${todoId}`, {completed: !completed}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            if(res?.data?.success){
                setTodos(todos.map(t => t._id === todoId ? res?.data?.todo : t))
            }
        } catch(err){
            console.log("error toggling todo: ", err);
            toast.error("Error updating todo")
        }
    }

    const handleDeleteTodo = async (todoId) => {
        try{
            const token = getToken()
            const res = await axios.delete(`/api/todo/delete/${todoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            if(res?.data?.success){
                toast.success(res?.data?.msg)
                setTodos(todos.filter(t => t._id !== todoId))
            }
        } catch(err){
            console.log("error deleting todo: ", err);
            toast.error("Error deleting todo")
        }
    }


    

  return (

    <div className='overflow-hidden flex'>


        <div className=' text-neutral-400 w-full h-auto bg-amber-200 z-33 '>

            <div onClick={handleSidebar} className='bg-neutral-700/50  rounded-md flex justify-center items-center p-0.5 cursor-pointer hover:text-white transition-all duration-100 absolute z-11 right-5 top-4.5 '>
                <MdEditNote className='text-2xl ' />  
            </div>

        </div>



        <div className={`h-screen bg-neutral-900/98 w-95  text-neutral-400 px-3 py-3 absolute flex flex-col   p-3    right-0 border border-y-0 border-r-0 border-l-neutral-700/50 transition-all z-10 duration-300 ${sidebar ? "-ml-none opacity-100" : " opacity-0 "}`}>

            <div className='flex items-center justify-between  border-2 border-neutral-700/40 border-x-0 border-t-0'>
                <p className='font-poppins font-semibold  text-2xl text-neutral-400 pb-3 px-3 pt-1'>Tasks</p>

                
                
            </div>
            

            <form onSubmit={handleSubmit} className=''>
                <div className='flex flex-row  items-center justify-center mt-5 mb-5 border-2 border-neutral-600/50 rounded-lg focus-within:border-2 focus-within:border-neutral-600 transition-all duration-100'>
                    
                    <button type='submit' className='size-9 hover:bg-neutral-700/50 text-white rounded-md  cursor-pointer active:scale-98 transition-all duration-100 text-2xl justify-center items-center -ml-6 '>+</button>
                
                    <input onChange={(e) => setTodo(e.target.value)} value={todo} type='text' className='outline-0 rounded-md w-73 h-11  px-3 font-poppins text-lg placeholder:text-neutral-500 -ml-2' placeholder='Add tasks' />

                </div>
            </form>



            <div className='pb-5 border border-b-neutral-600/40 border-t-0 border-x-0 overflow-y-auto flex-1 no-scrollbar'>
                {loading ? (
                    <p className='text-center text-neutral-500 mt-5'>Loading...</p>
                ) : todos.length === 0 ? (
                    <p className='text-center text-neutral-500 mt-5'>No todos yet</p>
                ) : (
                    todos.map((t) => (
                        <div onClick={() => handleToggleTodo(t._id, t.completed)} key={t._id} className='flex gap-2  justify-between px-5 pt-2 pb-3 border-b border-neutral-700/30 '>
                            <div className='flex gap-3 items-center flex-1'>
                                <button 
                                    onClick={() => handleToggleTodo(t._id, t.completed)}
                                    className='rounded-sm cursor-pointer transition-all duration-100 text-2xl hover:text-neutral-400'>
                                    {t.completed ? (
                                        <MdCheckBox className='text-green-600' />
                                    ) : (
                                        <MdCheckBoxOutlineBlank className='text-neutral-500' />
                                    )}
                                </button>
                                <p className={`font-poppins ${t.completed ? 'line-through text-neutral-600' : 'text-neutral-300'}`}>{t.text}</p> 
                            </div>
                            <button 
                                onClick={() => handleDeleteTodo(t._id)}
                                className='text-red-600/40 text-xl w-7 h-7 rounded-full ml-2 cursor-pointer active:scale-98 transition-all duration-100 justify-center items-center hover:bg-red-500/10 flex hover:text-red-500'>
                                <p className='pb-0.5'><RxCross2 /></p>
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    </div>
    
  )
}

export default Task