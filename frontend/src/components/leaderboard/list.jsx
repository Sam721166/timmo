import React from 'react'
import { LuRocket } from "react-icons/lu";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FaFire } from "react-icons/fa6";

function List() {
  return (
    <div className='w-full h-full bg-neutral-900 '>


        <div className='rounded-md border-2 border-white/10 w-250 h-screen   mt-2 '>

            <div className='border-b-2 border-white/10 flex  gap-10 font-poppins text-sm text-neutral-500 bg-white/5 rounded-t-md px-10 py-2 items-center justify-between h-10 w-full  '>

                <div className='flex gap-10 mr-70'>
                    <p>Rank</p>
                    <p>Name</p> 
                </div>
                
                <p>Today's time</p>
                <p className='mr-10'>Streak</p>

            </div>


            <div className='w-full h-screen overflow-scroll flex flex-col pb-1'
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "gray transparent",
                }} 
            >
                    
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 1</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-red-500/30 flex items-center justify-center text-xl">
                        <p>S</p>
                        </div>

                        <p className="truncate">
                        Samiran
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>7h 23m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>23 days</span>
                    </div>
                </div>


                    
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>
                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 h-15 items-center grid grid-cols-[80px_1fr_195px_135px]">


                    {/* Rank */}
                    <div>
                        <p># 2</p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="rounded-full size-7 bg-violet-500/30 flex items-center justify-center text-xl">
                        <p>M</p>
                        </div>

                        <p className="truncate">
                        Mike Jackson
                        </p>
                    </div>

                    {/* Time */}
                    <div className=''>
                        <p>4h 43m</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1  justify-center ">
                        <FaFire className="text-white" />
                        <span>12 days</span>
                    </div>
                </div>

                
                    

            </div>


        </div>

    </div>
  )
}

export default List