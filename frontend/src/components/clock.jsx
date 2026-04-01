import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';



function Clock() {


    const [time, setTime] = useState("");
    const [ampm, setAmpm] = useState("");




    useEffect(() => {
        const updateTime = () => {
        const now = new Date();
        const formatted = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const [hm, ap] = formatted.split(" ");

        setTime(hm);
        setAmpm(ap);
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

    const [hours, minutes] = time.split(":");

  return (
    <div className='flex flex-col h-screen w-screen  justify-center px-2 bg-neutral-900 '>


        


        <div className='flex items-baseline-last justify-center  mb-10'>
            <div className=' break-all  p-10 flex  w-auto ' > 
                
                <p className='text-white font-gothic leading-none text-[290px]  '>{hours}:</p>
                <p className='text-white font-gothic leading-none text-[290px] '>{minutes}</p>

            </div>

            <div className=' break-all   ' > 
                <p className='text-neutral-400 font-gothic leading-none text-3xl'>{ampm}</p>
            </div>
        </div>

        

    </div>
  )
}

export default Clock