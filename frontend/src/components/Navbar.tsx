import React from 'react'
import userAuthStore from '../store/userAuthStore'
import { Link } from 'react-router-dom';
import { BotMessageSquare, LogOut, Settings, UserCog } from 'lucide-react';
const Navbar = () => {
  const { authUser,logout } = userAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop:blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <BotMessageSquare className="text-primary"/>
              </Link>
            </div>
            
          </div>
          <div className="flex items-center gap-2">
            {authUser && (
              <>
              <Link to="/setting" className="btn btn-ghost gap-2 transition-colors">
                <Settings className="w-4 h-4"/>
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <Link to="/profile" className="btn btn-ghost gap-2 transition-colors">
                <UserCog className="w-4 h-4"/>
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button className="btn btn-ghost  gap-2 transition-colors" onClick={logout}>
                <LogOut className="w-4 h-4"/>
                <span className="hidden sm:inline">Logout</span>
              </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
    
  )
}

export default Navbar