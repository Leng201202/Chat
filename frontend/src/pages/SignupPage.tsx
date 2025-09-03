import React, { useState } from 'react'
import useUserAuthStore from '../store/userAuthStore';
import { BotMessageSquare, Eye, EyeOff, Key, Mail,  User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePatter';
import toast from 'react-hot-toast';
const SignupPage = () => {
  const [showPassword,setShowPassword]=useState(false);
  const [formData,setFormData]=useState({
    userName:'',
    email:'',
    password:''
  });

  const {signup,isSigningUp}=useUserAuthStore(); 

  const validateForm=()=>{
    if(!formData.userName.trim()) return toast.error("Username required");
    if(!formData.email.trim()) return toast.error("Email required");
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email)) return toast.error("Invalid email");
    if(formData.password.length<8) return toast.error("Password must be at least 8 characters long");
    return true;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    signup(formData);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BotMessageSquare className="size-10 text-primary"/>
                
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  id="username"
                  placeholder="John Doe"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>
            <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Key className="w-5 h-5 text-gray-500" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password" }
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input input-bordered w-full pl-10"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={()=>setShowPassword(!showPassword)}>
                    {showPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp} onClick={handleSubmit}>
              {isSigningUp ? (
                <>
                  <span className="loading loading-dots loading-xl"></span>
                  Signing Up...
                </>
              ):("Created Account")}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account? {" "}

              <Link to={"/login"} className="link link-primary">Log in</Link>

            </p>
          </div>
        </div>
      </div>
      {/* right side - image */}
      <AuthImagePattern 
      title="Join our community"
      subtitle="Connect, share, and grow with like-minded individuals on our platform."
      description="Learn, share, and grow together."
      />
    </div>
  )
}

export default SignupPage