"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dataByYear = {
  "2023": [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 180 },
    { month: "Mar", users: 300 },
    { month: "Apr", users: 250 }, // Pullback
    { month: "May", users: 500 },
    { month: "Jun", users: 750 },
    { month: "Jul", users: 700 }, // Pullback
    { month: "Aug", users: 1200 },
    { month: "Sep", users: 1100 }, // Pullback
    { month: "Oct", users: 1600 },
    { month: "Nov", users: 1400 }, // Pullback
    { month: "Dec", users: 2000 },
  ],
  "2024": [
    { month: "Jan", users: 2200 },
    { month: "Feb", users: 2400 },
    { month: "Mar", users: 3000 },
    { month: "Apr", users: 2800 }, // Pullback
    { month: "May", users: 3500 },
    { month: "Jun", users: 4000 },
    { month: "Jul", users: 4200 },
    { month: "Aug", users: 4500 },
    { month: "Sep", users: 4300 }, // Pullback
    { month: "Oct", users: 5000 },
    { month: "Nov", users: 4800 }, // Pullback
    { month: "Dec", users: 5500 },
  ]
};

const AChart = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Growth Trend</h2>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="
            text-sm
            border 
            rounded-md 
            pl-3 
            pr-8  // Extra padding on right for arrow
            py-1 
            appearance-none  // Removes default arrow
            cursor-pointer  // Shows pointer cursor
            w-24  // Fixed width
            text-sm  // Text size
            focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground
            bg-white          // Light mode background
            text-gray-900     // Light mode text
            dark:bg-gray-800  // Dark mode background
            dark:text-white   // Dark mode text
          "
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={dataByYear[selectedYear as keyof typeof dataByYear]} 
            margin={{ 
              top: 0, 
              right: 0, 
              left: 0, 
              bottom: 0  // Removes all internal padding
            }}
          >
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01B574" stopOpacity={0.5} />
                <stop offset="80%" stopColor="#01B574" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tick={{ fontSize: 10 }}/>
            <YAxis tick={{ fontSize: 10 }}/>
            <Tooltip
              contentStyle={{
                backgroundColor: "bg-background",  // Background color
                border: "1px solid #ddd", 
                borderRadius: "4px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "text-foreground" // Label text
              }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#01B574" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorUsers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AChart;