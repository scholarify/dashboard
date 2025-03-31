import React from 'react';
import { LogOut } from 'lucide-react';

// Define the types for the props
interface AvatarProps {
  avatarUrl: string; // URL for the avatar image
  name: string; // User's name
  role: string; // User's role (e.g., 'Admin', 'User')
  onLogout: () => void; // Logout function callback when clicking the logout icon
}

export default function Avatar({
  avatarUrl,
  name,
  role,
  onLogout
}: AvatarProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Left section: Avatar image and user info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          {/* Avatar Image */}
          <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full" />
        </div>
        <div className="flex flex-col">
          {/* Name and Role */}
          <span className="font-semibold">{name}</span>
          <span className="text-sm text-foreground">{role}</span>
        </div>
      </div>

      {/* Right section: Log out icon */}
      <div className="cursor-pointer" onClick={onLogout}>
        <LogOut className='text-teal'/>
      </div>
    </div>
  );
}
