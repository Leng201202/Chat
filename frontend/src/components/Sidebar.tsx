import React, { useEffect } from 'react';
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import type { ChatUser } from '../store/useChatStore';
import useUserAuthStore from '../store/userAuthStore';



const Sidebar = () => {
  // Pull from chat store (updated API names)
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    usersError,
  } = useChatStore();

  // onlineUsers may not exist yet; fallback to empty array
  const authState: any = useUserAuthStore();
  const onlineUsers: string[] = Array.isArray(authState?.onlineUsers) ? authState.onlineUsers : [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  if (isUsersLoading) return <SidebarSkeleton />

//   const filteredUsers = showOnlineOnly
//     ? users.filter((user) => onlineUsers.includes(user._id))
//     : users;

  if (isUsersLoading) return <SidebarSkeleton />

  if (usersError) {
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
        <div className="p-4 text-sm text-error">{usersError}</div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="w-full p-5 border-b border-base-300">
            <div className='flex items-center gap-2'>
                <Users className='size-6'/>
                <span className="font-medium">Contacts</span>
            </div>
            {/* online users toggle */}

        </div>
        <div className="overflow-y-auto w-full py-3">
  {(!Array.isArray(users) || users.length === 0) && (
    <div className="px-4 py-3 text-sm text-zinc-500">No contacts found</div>
  )}
  {Array.isArray(users) && users.map((user: ChatUser) => (  
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          > 
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.jpeg"}
                alt={user.userName || 'User'}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
  <div className="font-medium truncate">{user.userName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
      </div>
    </aside>
  )
}

export default Sidebar 