import React, { useState } from 'react'
import userAuthStore from '../store/userAuthStore';
import AuthImagePattern from '../components/AuthImagePatter';
import { BotMessageSquare, Eye, EyeOff, Key,Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword,setShowPassword]=useState(false);
    const [formData,setFormData]=useState({
      email:'',
      password:''
    });
    const {login,isLoggingIn}=userAuthStore();
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      login(formData);
    };
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
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn} onClick={handleSubmit}>
              {isLoggingIn ? (
                <>
                  <span className="loading loading-dots loading-xl"></span>
                  Signing In...
                </>
              ):("Sign In")}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account? {" "}

              <Link to={"/signup"} className="link link-primary">Sign up</Link>

            </p>
          </div>
        </div>
      </div>
      {/* right side - image */}
      <AuthImagePattern 
      title="Join our community"
      subtitle="Sign in to continue"
      description="Access exclusive content and connect with others."
      />
    </div>
  )
}

export default LoginPage