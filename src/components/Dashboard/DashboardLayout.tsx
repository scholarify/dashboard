
"use client"
import React from 'react'
import Divider from '../widgets/Divider'
import SearchBox from '../widgets/SearchBox'
import SidebarButton from './SideNavButton'
import { Home, Settings, User,LayoutDashboard  } from "lucide-react";


export default function DashboardLayout() {
  return (
    <div className='flex'>
        <div className='flex flex-col'>
            <div>logo</div>
            <Divider/> 
            <SearchBox/>
            <SidebarButton icon={LayoutDashboard} name="Dashboard" />

        </div>
        <div>
            <div>Navigation</div>
            <div>Content</div>
        </div>
    </div>
  )
}
