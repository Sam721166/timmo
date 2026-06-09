import React, { useState, useEffect } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

function Countdown() {

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);



  const [initialTime, setInitialTime] = useState(0)
  const [isSaved, setIsSaved] = useState(false)



  const saveCountdown = async () => {
    const timeUsed = initialTime - time;

    if (timeUsed <= 0) {
      toast.error("Run timer for at least 1 second");
      return;
    }

    try {
      const res = await axios.post(
        "/api/countdown/save", { totalTime: timeUsed }, { withCredentials: true }
      );

      toast.success(res?.data?.msg);

    } catch (err) {
      console.log(err);
      toast.error("Error saving countdown");
    }
  };


  
  
 


  // sync input with timer before starting
  useEffect(() => {
      if (!isRunning && !hasStarted) {
          const total = hours * 3600 + minutes * 60 + seconds;
          setTime(total);
      }
  }, [hours, minutes, seconds, isRunning, hasStarted]);


  useEffect(() => {

    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }

     if (time === 0 && hasStarted && !isSaved) {
      setIsRunning(false);
      saveCountdown(); 
      setIsSaved(true)
    }

    return () => clearInterval(interval);
  }, [isRunning, time, hasStarted, isSaved]);



  const start = () => {

    if(!hasStarted){
      setInitialTime(time)
      setIsSaved(false);
    }

    setHasStarted(true);
    setIsRunning(true);
    
  };


  const pause = () => {
    
    setIsRunning(false);


  }


  const reset = async () => {
    
    if(hasStarted && !isSaved){
      setIsSaved(true); 
      await saveCountdown();
    }
    
    setIsRunning(false);
    setHasStarted(false);

    const total = hours * 3600 + minutes * 60 + seconds;
    setTime(total);
  };



  // convert seconds → display
  const displayHours = String(Math.floor(time / 3600)).padStart(2, "0");
  const displayMinutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const displaySeconds = String(time % 60).padStart(2, "0");



  return (
    <div className="bg-neutral-900 p-4 sm:p-5 w-screen h-screen text-white justify-center flex flex-col items-center overflow-y-auto">

      {/* Timer Display */}
      <p className="text-[55px] sm:text-6xl md:text-8xl lg:text-9xl xl:text-[200px] font-gothic font-bold text-center">
        {displayHours}:{displayMinutes}:{displaySeconds}
      </p>


      {/* Time Inputs */}
      <div className="flex gap-2 sm:gap-4 mt-6 flex-wrap justify-center px-2">

        <input
          type="number"
          step="1"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          placeholder="hh"
          value={hours}
          onChange={(e) =>
            setHours(Math.min(12, Math.max(0, Number(e.target.value))))
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

        <input
          type="number"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          max="59"
          placeholder="mm"
          value={minutes}
          onChange={(e) =>
            setMinutes(
              Math.min(59, Math.max(0, Number(e.target.value)))
            )
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

        <input
          type="number"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          max="59"
          placeholder="ss"
          value={seconds}
          onChange={(e) =>
            setSeconds(
              Math.min(59, Math.max(0, Number(e.target.value)))
            )
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

      </div>


      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-8 justify-center flex-wrap px-2">

            
            {
                isRunning ? (
                     <button onClick={pause} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPause className='mr-2 text-lg sm:text-[21px]' />
                        Pause
                    </button>
                ) : (
                    <button onClick={start} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPlay className='mr-2 text-base sm:text-[16px]' />
                        Start
                    </button>
                )
            }


            <button onClick={reset} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                <RiResetLeftLine className='mr-2 text-lg sm:text-[20px]' />
                Reset
            </button>

      </div>

    </div>
  );
}

export default Countdown;