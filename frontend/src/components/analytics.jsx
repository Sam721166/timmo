import React from 'react'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/shadcn/chart"

import { BarChart, Bar, XAxis } from "recharts"

const data = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
]


function Analytics() {
  return (
    <div className='bg-neutral-900 p-10 h-screen w-screen'>
      <ChartContainer
        className="h-[300px] w-50 "
        config={{
          value: {
            label: "Time",
            color: "var(--chart-1)",
          },
        }}
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)"  />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Analytics