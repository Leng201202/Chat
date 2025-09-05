import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

// Socket.io base URL - use environment variable if available
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
                   (import.meta.env.MODE === 'development' 
                    ? 'http://localhost:8000' 
                    : window.location.origin);
// Align with backend signup/login response fields
type AuthUser = {
  _id: string;
  email: string;
  userName: string;
  profilePic?: string;
  token?: string; // signup returns token (generated + cookie); keep optional
  createdAt?: string; // <-- added (ISO date string from backend)
} | null;

interface SignupData {
  userName: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}
interface profilePicData {
  profilePic: File | string | null;
}

interface AuthState {
  authUser: AuthUser;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: string[];
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: profilePicData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useUserAuthStore = create<AuthState>((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => { 
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;
      set({ authUser: user });
      get().connectSocket(); 
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // Backend expects keys: email, userName, password
      const payload = {
        email: data.email.trim(),
        userName: data.userName.trim(),
        password: data.password,
      };
      console.log("Signup payload actually sent:", payload);
      const res = await axiosInstance.post("/auth/signup", payload);
      set({ authUser: res.data });
      toast.success("Account created");
      get().connectSocket(); // <-- added
    } catch (error) {
      let msg = "Signup failed";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data
      ) {
        const serverMsg =
          (error as any).response.data.message ||
          (error as any).response.data.error;
        if (typeof serverMsg === "string") msg = serverMsg;
        console.error("Signup server response:", (error as any).response.data);
      } else {
        console.error("error in signup", error);
      }
      console.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res= await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");
      get().connectSocket(); // <-- added
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      
    }finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // <-- added
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
  updateProfile: async (data)=>{
    set({ isUpdatingProfile: true });
    try {
      const res= await axiosInstance.put("/auth/update-profile", data); 
      // Backend returns: { message: string, user: {...updatedUser} }
      const updatedUser = (res.data && (res.data as any).user) ? (res.data as any).user : res.data;
      set(prev => ({
        authUser: prev.authUser ? { ...prev.authUser, ...updatedUser } : updatedUser
      }));
      toast.success("Profile updated successfully");
      console.log("Profile update response (parsed user):", updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed");
    }finally{
      set({ isUpdatingProfile: false });
    }

  },
  connectSocket: () => {
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(SOCKET_URL,{
      query: { userId: authUser._id }
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers",(userIds)=>{
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect();
  }

}));

export default useUserAuthStore;


