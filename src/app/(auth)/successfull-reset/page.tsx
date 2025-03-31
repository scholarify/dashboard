"use client";
import { FormEvent, useState } from "react";
import AppLogo from "@/components/AppLogo";
import FormHeading from "@/components/FormHeading";
import '@/styles/formStyle.css';


export default function SuccessfullResetPassword() {
    return (
        <div className="flex bg-white dark:bg-gray-900 dark:text-white  rounded-lg shadow-lg h-screen">
            {/* Section de l'image latérale */}
            <div className="asideLogo w-[50%] h-screen py-2">
                <div className="asideImage w-full h-full">
                    <img src="/assets/images/asideImage.png" className="h-full w-full rounded-[25px]" alt="Aside Image" />
                </div>
            </div>

            <div className="asideForm  bg-white dark:bg-gray-900 flex flex-col justify-evenly items-center m-auto w-full  ">
                <div className="  flex flex-col justify-evenly items-center m-auto w-full max-w-[500px]  dark:text-white py-6">
                    <AppLogo logoSrc="/assets/logo.png" logoAlt="Logo" />
                    <div>
                        <FormHeading
                            title="Good to go!"
                            subtitle="Your password has been reset successfully."
                            formIcon={
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.25" y="1.25" width="47.5" height="47.5" rx="13.75" stroke="#17B890" stroke-width="2.5" />
                                    <path d="M32.5 23.75V30.8333C32.5 31.2754 32.3244 31.6993 32.0118 32.0118C31.6993 32.3244 31.2754 32.5 30.8333 32.5H19.1667C18.7246 32.5 18.3007 32.3244 17.9882 32.0118C17.6756 31.6993 17.5 31.2754 17.5 30.8333V19.1667C17.5 18.7246 17.6756 18.3007 17.9882 17.9882C18.3007 17.6756 18.7246 17.5 19.1667 17.5H29.5833" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M22.5 24.1654L25 26.6654L33.3333 18.332" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }
                        />
                        <div className="space-x-1 text-center text-sm text-muted-foreground flex w-full justify-center">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.1634 15.5876C13.3396 15.7637 13.4385 16.0026 13.4385 16.2516C13.4385 16.5007 13.3396 16.7396 13.1634 16.9157C12.9873 17.0918 12.7484 17.1908 12.4994 17.1908C12.2503 17.1908 12.0114 17.0918 11.8353 16.9157L5.58531 10.6657C5.49791 10.5786 5.42856 10.4751 5.38124 10.3611C5.33393 10.2472 5.30957 10.125 5.30957 10.0016C5.30957 9.87824 5.33393 9.75606 5.38124 9.64211C5.42856 9.52815 5.49791 9.42466 5.58531 9.33756L11.8353 3.08756C12.0114 2.91144 12.2503 2.8125 12.4994 2.8125C12.7484 2.8125 12.9873 2.91144 13.1634 3.08756C13.3396 3.26368 13.4385 3.50255 13.4385 3.75163C13.4385 4.0007 13.3396 4.23957 13.1634 4.41569L7.57828 10.0008L13.1634 15.5876Z"
                                    fill="#17B890" />
                            </svg>
                            <span>Back to </span>
                            <a href="/login" className="text-[#17B890]">Log in</a>
                        </div>
                    </div>
                    <div className="navigation-bars flex gap-2 p-2">
                        <div className="navigationItem"></div>
                        <div className="navigationItem "></div>
                        <div className="navigationItem"></div>
                        <div className="navigationItem active"></div>
                    </div>
                </div>
            </div>
        </div >
    );
}