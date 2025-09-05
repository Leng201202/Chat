import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import userAuthStore from "./userAuthStore";

export interface ChatUser {
  _id: string;
  userName: string;
  profilePic?: string;
}
// Define or import the Message type
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt?: string; // backend may provide
  updatedAt?: string; // backend may provide
}

export interface SendMessageData {
  text: string;
  image?: string | null;
}

interface ChatStoreState {
  sendingMessage: boolean;
  messages: Message[];
  users: ChatUser[];
  selectedUser: ChatUser | null | any;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  usersError: string | null;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: ChatUser | null) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  sendingMessage: false,
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  usersError: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/users");
  const apiUsers = Array.isArray(res.data?.users) ? res.data.users : [];
  set({ users: apiUsers });
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      set({ isUsersLoading: false });
    }
},

getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get<{ messages: Message[] }>(`/api/messages/${userId}`);
        // Check if res.data.messages exists and is an array
        if (res.data && res.data.messages && Array.isArray(res.data.messages)) {
            set({ messages: res.data.messages });
        } else {
            // Fallback to empty array if data structure is unexpected
            console.error("Unexpected messages data structure:", res.data);
            set({ messages: [] });
        }
    } catch (error: any) {
        toast.error(error.response.data.message);
        set({ messages: [] }); // Reset messages on error
    } finally {
        set({ isMessagesLoading: false });
    }
},
sendMessage: async (messageData: SendMessageData) => {
    set({ sendingMessage: true });
    const { selectedUser,  } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    if(!messageData.text && !messageData.image){
      return; // nothing to send
    }
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      console.log(messageData);
      console.log("Message sent:", res.data);
      // Append the new message to existing messages instead of replacing
      set((state) => ({
        messages: [...state.messages, res.data]
      }));
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send message");
    }finally{
      set({ sendingMessage: false });
    }
  },
  subscribeToMessages: () => {
    const selectedUser = get().selectedUser;
    if(!selectedUser) return;
    const socket = userAuthStore.getState().socket;
    //optimize later
    
    socket?.on("newMessage", (newMessage: Message) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      if(!isMessageFromSelectedUser) return; // only add if the message is from the selected user
      set({messages: [...get().messages, newMessage]});
    })

  },
  unsubscribeFromMessages: () => {
    const socket = userAuthStore.getState().socket;
    socket?.off("newMessage"); 
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));