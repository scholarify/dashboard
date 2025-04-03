import React from 'react'
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsOverviewProps {
  value: number | string
  changePercentage?: number
  icon?: React.ReactNode
  title?: string
}

export default function StatsOverview({ 
  value, 
  changePercentage = 5.78,
  icon = <DollarSign className="h-3 w-3 text-background" />,
  title = "Total Revenue" 
}: StatsOverviewProps) {
  const isPositive = changePercentage >= 0
  const changeColor = isPositive ? 'text-[#01B574]' : 'text-[#FF3B3B]'
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <div className="rounded-lg flex items-center border border-stroke p-4 shadow-sm bg-background">
      <div className='space-y-2'>
        <div className="rounded-lg w-fit bg-foreground p-3">
        {React.cloneElement(icon as React.ReactElement, {
            className: "h-3 w-3 text-background" // Ensures consistent sizing
          })}
        </div>
        <div className="flex items-center">
          <div className="">
            <h3 className="text-sm font-medium text-black dark:text-white">{title}</h3>
            <div className={`flex items-center text-sm ${changeColor}`}>
              <ChangeIcon className="h-4 w-4" />
              <span>{Math.abs(changePercentage)}%</span>
              <span className="text-gray-500 ml-1">Since last month</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  )
}