import React from 'react'
import { useChatStore } from '../store/useChatStore';
import userAuthStore from '../store/userAuthStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser,setSelectedUser } = useChatStore();
  const {onlineUsers}=userAuthStore();
  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='Avatar'>
            <div className='w-10 h-10 rounded-full relative'>
              <img src={selectedUser?.profilePic || "avatar.jpeg"} alt={selectedUser?.userName} className='rounded-full w-10 h-10 object-cover'/>
            </div>
          </div>
          {/* user info */}
          <div>
            <h3 className='font-medium'>{selectedUser?.userName || "Unknown User"}</h3>
            <p className='text-sm text-base-content/70'>{onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}</p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

    </div>
  )
}

export default ChatHeader