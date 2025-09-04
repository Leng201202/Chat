import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import userAuthStore from './store/userAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Toaster } from 'react-hot-toast'

function App() {
  const {authUser,checkAuth,isCheckingAuth}=userAuthStore();
  const { theme } = useThemeStore(); 
  useEffect(()=>{
    checkAuth();

  },[checkAuth]);
  console.log({authUser}); 
  if(isCheckingAuth && !authUser){
    return (
        <div className='flex justify-center items-center h-screen'>
            <span className="loading loading-dots loading-xl"></span>
        </div>
    )
   
    
  }
  return (
    <div data-theme={theme} className="min-h-screen flex flex-col bg-base-300">
      <Navbar />
      <main className="flex-1 flex justify-center px-4">
        {/* page content wrapper */}
        <div className="w-full max-w-3xl py-8">
          <Routes>
            <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
            <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
            <Route path="/signup" element={!authUser ? <SignupPage/>:<Navigate to="/"/>} />
            <Route path="/setting" element={authUser ? <SettingPage/>: <Navigate to="/login"/>} />
            <Route path='/profile' element={authUser ? <ProfilePage/>:<Navigate to="/login"/>} />
          </Routes>
        </div>
      </main>
      <Toaster/>
    </div>
  )
}

export default App
