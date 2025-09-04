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
  content: string;
  timestamp: string;
}

export interface SendMessageData {
  content: string;
  // add additional fields your API expects here (e.g. attachments, metadata)
  [key: string]: any;
}

interface ChatStoreState {
  messages: Message[];
  users: ChatUser[];
  selectedUser: ChatUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  usersError: string | null;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
//   subscribeToMessages: () => void;
//   unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: ChatUser | null) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  usersError: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
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
        const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
        set({ messages: res.data });
    } catch (error: any) {
        toast.error(error.response.data.message);
    } finally {
        set({ isMessagesLoading: false });
    }
},
sendMessage: async (messageData: SendMessageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = userAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = userAuthStore.getState().socket;
//     socket.off("newMessage");
//   },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));