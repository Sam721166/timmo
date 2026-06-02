import React from 'react'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/shadcn/chart"

import { BarChart, Bar, XAxis } from "recharts"

const data = [
  { month: "Jan", value: 340 },
  { month: "Feb", value: 200 },
  { month: "Jan", value: 410 },
  { month: "Feb", value: 550 },
  { month: "Jan", value: 390 },
  { month: "Feb", value: 265 },
  { month: "Jan", value: 340 },
  { month: "Feb", value: 450 },
]


function Analytics() {
  return (
    <div className='bg-neutral-900 p-10 h-screen w-screen'>
      <ChartContainer
        className="h-[340px] w-50% rounded-lg border-2  border-neutral-800 pb-7 overflow-hidden"
        config={{
          value: {
            label: "Time",
            color: "var(--chart-1)",
          },
        }}
      >
        <div className='text-xl font-poppins border-2 border-b-neutral-800 border-x-0 border-t-0  w-160 h-12 z-12 flex items-center pl-3'>
          Time
        </div>

        <BarChart data={data} className='p-3 '>
          <XAxis dataKey="month" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Analytics