import React from 'react'

function Settings() {
  return (
    <div className='h-screen w-screen min-w-0 overflow-y-auto bg-neutral-900 px-5 py-6 text-white sm:px-8 lg:px-10 flex justify-center'>
      
    <div className='flex flex-col gap-2 border-b border-white/10 pb-5 bg-amber-400 w-7xl'>
          <p className='font-poppins text-sm  tracking-[0.1em] text-neutral-500'>Analytics</p>
          <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
            <h1 className='font-poppins text-3xl font-semibold tracking-normal text-white sm:text-4xl'>
              Focus overview
            </h1>
          </div>
        </div>

    </div>
  )
}

export default Settings