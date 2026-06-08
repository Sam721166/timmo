import React from 'react'
import { useState, useEffect } from 'react'
import { RiResetLeftLine } from "react-icons/ri";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import axios from "axios"
import toast from 'react-hot-toast';

function Stopwatch() {

    const [isRunning, setIsRunning] = useState(false);


    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    // const [totalSecond, setTotalSecond] = useState(0);

    


    const [, forceUpdate] = useState(0);

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                forceUpdate(prev => prev + 1); // just re-render
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);



    const displayTime = isRunning && startTime ? elapsedTime + (Date.now() - startTime) : elapsedTime;


    const totalSeconds = Math.floor(displayTime / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");



    const startHandler = () => {
        setIsRunning(true);

        setStartTime(Date.now())
    };

    const pauseHandler = () => {
        setIsRunning(false);
        
        setElapsedTime(prev => prev + (Date.now() - startTime));

        setStartTime(null)
    };

    const resetHandler = async () => {
        setIsRunning(false);

        let finalTime = elapsedTime;
        
        if (startTime) {
            finalTime += Date.now() - startTime;
        }

        const totalSecond = Math.floor(finalTime / 1000);

        if (totalSecond <= 0) {
            toast.error("Run stopwatch for at least 1 second");
            return;
        }

        setElapsedTime(0);
        setStartTime(null);

        try{
            const res = await axios.post("/api/stopwatch/save", {totalTime: totalSecond}, {withCredentials: true})

            toast.success(res?.data?.msg)
            
        } catch(err){
            console.log("error while saving stopwatch total time: ", err);
            toast.error(err?.response?.data?.msg || "Error while saving stopwatch total time", err)
        }
        
    };



  return (
    <div className='bg-neutral-900 p-4 sm:p-5 w-screen h-screen text-white  flex flex-col justify-center items-center overflow-y-auto'>
        
        <p className="text-[55px] sm:text-6xl md:text-8xl lg:text-9xl xl:text-[200px] font-gothic font-bold text-center">
            {hours}:{minutes}:{seconds}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-8 sm:mt-10 justify-center flex-wrap px-2">

            {
                isRunning ? (
                     <button onClick={pauseHandler} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPause className='mr-2 text-lg sm:text-[21px]' />
                        Pause
                    </button>
                ) : (
                    <button onClick={startHandler} className='rounded-md bg-neutral-800 w-50 sm:w-40  h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPlay className='mr-2 text-base sm:text-[16px]' />
                        Start
                    </button>
                )
            }

            <button onClick={resetHandler} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
            <RiResetLeftLine className='mr-2 text-lg sm:text-[20px]' />
            Reset
            </button>
        </div>
    </div>
  )
}

export default Stopwatch