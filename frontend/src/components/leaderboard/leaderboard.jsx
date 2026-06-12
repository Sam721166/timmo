import React from 'react'
import List from "../leaderboard/list"
import { FaCrown, FaFire } from "react-icons/fa6";
import Sidecard from './sidecard';


function Leaderboard() {
  return (
    <div className='w-screen h-screen bg-neutral-900  justify-center flex pt-10 font-poppins overflow-y-scroll '
    style={{
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
    }} >

        <div className='flex w-7xl min-w-0 h-full gap-2'>

            <div className='w-7xl  min-w-0 h-full flex gap-2 flex-col ' >
                
                <div className='flex flex-col gap-2 border-b border-white/10 pb-5  h-12  w-250 min-w-0  '>
                    <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end pb-9'>
                        <h1 className='font-poppins text-2xl font-semibold tracking-normal text-white sm:text-4xl'>
                            Leaderboard
                        </h1>
                    </div>


                </div>


                <div className='w-250 flex justify-between items-center gap-3  '>
                    <div className=' border-2 border-white/10 rounded-lg w-35 h-10 cursor-pointer active:scale-99 transition-all duration-200 bg-neutral-900 flex justify-center items-center'>
                        <p className='font-poppins tracking-tight px-3 py-1  rounded-sm w-33 bg-white/10 '>Last 24 hours</p>
                    </div>

                    <div className='text-sm text-neutral-500 border-2 font-poppins bg-white/2 border-white/10 rounded-sm px-3 tracking-tight font-semibold py-1 flex gap-2 items-center justify-center'>
                        <div className='bg-green-500 text-xl rounded-full size-2'></div>
                        <p>Updates every 5 minutes</p>
                    </div>
                    
                </div>


                <div className=' rounded-md w-250 h-50 border-2 border-white/5 pl-7   mt-2 font-poppins flex '>
                    <div className='h-full bg-yellow-300 w-0.5  -ml-7 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)] '></div>
                    <div className='flex flex-col gap-3 h-full justify-center pl-7 '>
                        <p className='text-2xl font-semibold tracking-tight w-100 '>
                            <span className='mr-2  text-amber-300 '>
                                Nigga 
                            </span>
                            is grinding like hell… and you’re still waiting for her reply.
                        </p>
                        <p className='text-neutral-500 text-xs tracking-tight'>
                            Showing top 100 users. 
                            <span> • Your rank: #1</span>
                        </p>
                    </div>

                    <div className=' overflow-hidden w-full rounded-sm h-full'>
                        <img src="hero.webp" alt="hero ui" className='rounded-sm -mt-14 '
                            style={{
                                WebkitMaskImage:
                                    "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",
                                maskImage:
                                    "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",
                            }}
                        />
                    </div>

                </div>

                
                <div className='w-full h-full bg-neutral-900 '>
                
                
                        <div className='rounded-md border-2 border-white/10 w-250 h-auto   mt-2 '>
                
                            <div className='border-b-2 border-white/10 gap-10 font-poppins text-sm text-neutral-500 bg-white/5 rounded-t-md px-10 py-2 items-center flex  justify-between h-10 w-full  '>
                
                                <div className='flex gap-10 mr-70'>
                                    <p>Rank</p>
                                    <p>Name</p> 
                                </div>
                                
                                <p>Today's time</p>
                                <p className='mr-10'>Streak</p>
                
                            </div>
                
                
                            <div className='w-full h-auto   flex flex-col pb-1 overflow-hidden'
                            >
                                    
                                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px] ">
                
                
                                    {/* Rank */}
                                    <div className='rounded-full text-xs size-8 border-2 border-yellow-500 bg-gradient-to-r
                                    from-amber-500/15
                                    via-yellow-500/10
                                    to-transparent flex items-center justify-center font-bold shadow-[0_0_10px_0px] shadow-yellow-400 '
                                    style={{
                                        animation: 'glow 3s ease-in-out infinite'
                                    }}>
                                        <span></span>
                                        <span className=''>1</span>
                                    </div>
                
                                    {/* User */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="rounded-full size-8 bg-red-500/30 flex items-center justify-center text-xl">
                                        <p>N</p>
                                        </div>
                
                                        <div className='flex flex-col '>
                                            <p className="truncate">
                                                Nigga
                                            </p>
                                            <p className="text-xs text-yellow-400">
                                                Has No Life
                                            </p>
                                        </div>
                                        
                                        
                                    </div>
                
                                    {/* Time */}
                                    <div className=''>
                                        <p>7h 23m</p>
                                    </div>
                
                                    {/* Streak */}
                                    <div className="flex items-center gap-1  justify-center ">
                                        <FaFire className="text-white" />
                                        <span>67 days</span>
                                    </div>
                                </div>
                                    
                                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px] ">
                
                
                                    {/* Rank */}
                                    <div className='rounded-full text-xs size-8  flex items-center border-2 justify-center font-bold bg-zinc-400/5
                                    border-zinc-300/40
                                    shadow-[0_0_20px_rgba(212,212,216,0.08)]'
                                    style={{
                                        animation: 'silverGlow 3s ease-in-out infinite'
                                    }}>
                                        <span></span>
                                        <span className=''>2</span>
                                    </div>
                
                                    {/* User */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="rounded-full size-8 bg-purple-400/30 flex items-center justify-center text-xl">
                                        <p>R</p>
                                        </div>
                
                                        <div className='flex flex-col '>
                                            <p className="truncate">
                                                Ram
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                Touch Grass
                                            </p>
                                        </div>
                                        
                                        
                                    </div>
                
                                    {/* Time */}
                                    <div className=''>
                                        <p>4h 13m</p>
                                    </div>
                
                                    {/* Streak */}
                                    <div className="flex items-center gap-1  justify-center ">
                                        <FaFire className="text-white" />
                                        <span>12 days</span>
                                    </div>
                                </div>
                
                                    
                                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px] ">
                
                
                                    {/* Rank */}
                                    <div className='rounded-full text-xs size-8  flex items-center border-2 justify-center font-bold bg-orange-500/5
                                    border-orange-400/40
                                    shadow-[0_0_20px_rgba(251,146,60,0.08)]'
                                    style={{
                                        animation: 'bronzeGlow 3s ease-in-out infinite'
                                    }}>
                                        <span></span>
                                        <span className=''>3</span>
                                    </div>
                
                                    {/* User */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="rounded-full size-8 bg-yellow-400/30 flex items-center justify-center text-xl">
                                        <p>J</p>
                                        </div>
                
                                        <div className='flex flex-col '>
                                            <p className="truncate">
                                                Jack
                                            </p>
                                            <p className="text-xs text-orange-400/80">
                                            Locked In
                                            </p>
                                        </div>
                                        
                                        
                                    </div>
                
                                    {/* Time */}
                                    <div className=''>
                                        <p>2h 3m</p>
                                    </div>
                
                                    {/* Streak */}
                                    <div className="flex items-center gap-1  justify-center ">
                                        <FaFire className="text-white" />
                                        <span>3 days</span>
                                    </div>
                                </div>
                                    
                                <div className="bg-white/2 border-b-2 border-white/10 px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px] ">
                
                
                                    {/* Rank */}
                                    <div className='rounded-full text-xs size-8  flex items-center  justify-center font-bold bg-white/5
                                    border-white/20'>
                                        <span className=''>4</span>
                                    </div>
                
                                    {/* User */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="rounded-full size-8 bg-blue-400/30 flex items-center justify-center text-xl">
                                        <p>M</p>
                                        </div>
                
                                        <div className='flex flex-col '>
                                            <p className="truncate">
                                                Mike
                                            </p>
                                        </div>
                                        
                                        
                                    </div>
                
                                    {/* Time */}
                                    <div className=''>
                                        <p>1h 46m</p>
                                    </div>
                
                                    {/* Streak */}
                                    <div className="flex items-center gap-1  justify-center ">
                                        <FaFire className="text-white" />
                                        <span>1 days</span>
                                    </div>
                                </div>
                
                
                
                                
                                <div className='px-10 w-full h-20 font-poppins text-neutral-500 text-sm flex items-center justify-center gap-1 flex-col '>
                                    <p>Showing top 100 users.</p>
                                    <p className='text-neutral-600'>Procrastinators were filtered out.</p>
                                </div>
                
                            </div>
                
                
                        </div>
                
                </div>

                

            </div>

            <div className='flex justify-center items-start'>
                <Sidecard />
            </div>
        </div>
        
    </div>
  )
}

export default Leaderboard