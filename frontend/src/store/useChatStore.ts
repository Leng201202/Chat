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
  messages: Message[];
  users: ChatUser[];
  selectedUser: ChatUser | null | any;
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
        const res = await axiosInstance.get<Message[]>(`/api/messages/${userId}`);
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
    if(!messageData.text && !messageData.image){
      return; // nothing to send
    }
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      console.log(messageData)
      console.log("Message sent:", res.data);
      set({ messages: [res.data] });
    } catch (error: any) {
      console.error(error);
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