import React from 'react'
import { MdArrowOutward } from "react-icons/md";

function Sidecard() {
  return (
    <div className='h-auto font-poppins rounded-md w-85 -mr-20 min-w-0 mt-15 px-3 py-3 border-2 border-white/10 bg-whit flex flex-col gap-3 bg-white/2'>

      <div className='rounded-md  w-full h-41 p-3 flex flex-col items-center justify-center gap-2 bg-neutral-900 border-2 border-white/5'>
        <div>
            <div className='size-15 rounded-full bg-white/20 flex justify-center items-center font-semibold text-3xl'>
              <p>N</p>
            </div>
        </div>
        <div className='flex flex-col gap-2 items-center'>
          <p className='text-xl font-semibold text-y'>Nigga</p>
          <p className='text-xs text-neutral-500 tracking-tight rounded-full bg-white/7 pr-3 pl-2 py-1 flex gap-1 items-center border border-white/10'>
          <MdArrowOutward className='size-4' />
          Top 1% in Timmo users </p>
        </div>
      </div>

      <div className='rounded-md w-full min-h-55 px-3 py-3 flex flex-col gap-1 justify-center bg-neutral-900 border-2 border-white/5'>

        <p className='tracking-tight  text-neutral-400 '>Today's summary</p>
      
        <div className='w-full min-h-45 grid grid-cols-2 gap-2 justify-center items-center mt-2'>
          <div className='rounded-sm  h-full w-full px-3 flex justify-center flex-col bg-yellow-400/5'>
            <p className='text-white mb-0.5'>Rank</p>
            <p className='text-yellow-400 text-xl font-semibold'># 1</p>
            <p className='text-neutral-500 text-xs '>Today</p>
          </div>

          <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-orange-400/5'>
            <p className='text-white mb-0.5 '>Streak</p>
            <p className='text-orange-400 text-xl font-semibold'>67 days</p>
            <p className='text-neutral-500 text-xs '>Current</p>
          </div>

          <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-blue-400/7'>
            <p className='text-white mb-0.5'>Focus Time</p>
            <p className='text-blue-400 text-xl font-semibold'>7h 23m</p>
            <p className='text-neutral-500 text-xs '>Today</p>
          </div>

          <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-green-500/5'>
            <p className='text-white mb-0.5'>Percentage</p>
            <p className='text-green-500 text-xl font-semibold'>1 %</p>
            <p className='text-neutral-500 text-xs '>Today</p>
          </div>

          
        </div>
        
      </div>



      <div className="relative h-40 overflow-hidden rounded-md border border-white/10 bg-neutral-900 p-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent" />

        <div className="absolute right-[-15px] bottom-[-14px]">
          <img
            src="/earth.webp"
            alt=""
            className="w-43 opacity-50 mask-l-from-40% mask-b-from-50%  grayscale"
          />
        </div>

        <div className="relative z-10">
          <p className="text-sm text-neutral-500">
            You vs The World
          </p>

          <div className="mt-3 flex items-end gap-1">
            <span className="text-5xl font-bold text-white">
              97
            </span>
            <span className="mb-1 text-2xl font-semibold text-neutral-500">
              %
            </span>
          </div>

          <p className="mt-2 w-[170px] text-sm text-neutral-400">
            Focused more than 97% of users today.
          </p>
        </div>
      </div>

    </div>
  )
}

export default Sidecard