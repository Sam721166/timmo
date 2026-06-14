import { useState } from 'react'
import './App.css'
import Clock from './components/clock'
import Sidebar from './components/sidebar'
import Body from './components/body'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"


function App() {
 

  return (
    <>
    <div className='flex  selection:text-black selection:bg-white overflow-hidden'>
      <Analytics />
      <Body />
    </div>
    <Toaster position="top-center" />
    </>
  )
}

export default App
