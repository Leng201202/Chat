import React, { useState } from 'react'
import useUserAuthStore from '../store/userAuthStore';
import { Camera, Mail, User } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useUserAuthStore();

  // Only store a base64 string (or null)
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // (Optional) simple validation
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        setSelectedImg(reader.result);              // state now string | null
        await updateProfile({ profilePic: reader.result }); // OK: string
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    
      <div className="min-h-full pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="mt-2">Your profile infomations</p>
            </div>
            {/* Avanter upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img src={selectedImg||authUser?.profilePic || "avatar.jpeg"} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2" />
                <label htmlFor="avatar-upload" className={`
                  absolute bottom-0 right-0 bg-base-content 
                  rounded-full hover:scale-105
                  p-2 cursor-pointer transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}>
                  <Camera className="w-4 h-4 text-base-200" />
                  <input type="file" id="avatar-upload" className="hidden" accept='image/*' onChange={handleImageUpload} disabled={isUpdatingProfile} />

                </label>
              </div>
              <p className="text-sm text-center">
                {isUpdatingProfile ? <span className="loading loading-dots loading-md"></span> : "Click the camera icons to update your photo"}
              </p>
            </div>
            {/* Information */}
            <div className="space-y-6">
              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <User className="w-6 h-6" />
                  Name
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.userName || "Unknown User"}</p>

              </div>
              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <Mail className="w-6 h-6" />
                  Email
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email || "Unknown Email"}</p>
              </div>
            </div>
            {/* Active status */}
            <div className='mt-6 bg-base-300 rounded-xl p-6'>
              <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member Since</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default ProfilePage