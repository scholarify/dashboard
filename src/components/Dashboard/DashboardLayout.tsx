"use client"
import React from 'react'
import Divider from '../widgets/Divider'
import SearchBox from '../widgets/SearchBox'
import SidebarButton from './SideNavButton'
import Avatar from './Avatar'
import { Wallet, School, Users, LayoutDashboard, Presentation, GraduationCap, Settings } from "lucide-react";
import Logo from '../widgets/Logo'
import GoPro from './GoPro'
import NavigationBar from './NavigationBar'

export default function DashboardLayout() {
    const handleLogout = () => {
        console.log('Logged out');
      };
  return (
    <div className='flex h-screen p-4'>
        <div className='flex w-[290px] flex-col h-full border border-stroke p-2 rounded-lg'>
            <div className='flex flex-col gap-3 '>
                <div className='flex flex-col items-center gap-2 my-4'>
                    <Logo/>
                    <Divider/> 
                </div> 

                <SearchBox/>
                <div>
                    <SidebarButton icon={LayoutDashboard} name="Dashboard" href='/'/>
                    <SidebarButton icon={School} name="Schools" href='/' />
                    <SidebarButton icon={Users} name="Users" href='/'/>
                    <SidebarButton icon={Wallet} name="Subscription" href='/'/>
                    <SidebarButton icon={Presentation} name="Classes" href='/'/>
                    <SidebarButton icon={GraduationCap} name="Student"href='/' />
                </div>
            </div>

            {/* This div will push the Settings button to the bottom */}
            <div className='mt-auto flex flex-col gap-3'>
                <GoPro/>
                <SidebarButton icon={Settings} name="Settings" href='/'/>
                <Divider/> 
                <Avatar 
                    avatarUrl="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                    name="John Doe"
                    role="Super Admin"
                    onLogout={handleLogout}
                />  
            </div>
        </div>

        <div className='px-6 py-2 w-full'>
            <NavigationBar/>
            <div>Content</div>
        </div>
    </div>
  )
}
