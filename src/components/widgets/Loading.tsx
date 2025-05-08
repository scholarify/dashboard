import React from 'react'
import CircularLoader from './CircularLoader'; // Replace 'some-library' with the actual library or file path

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/90">
            <CircularLoader size={32} color="teal" />
        </div>
    )
}
