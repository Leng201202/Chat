import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './skeleton/MessageSkeleton';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto '>
      <ChatHeader />
      <MessageSkeleton />
      <ChatInput />
    </div>
  )
    
  return (
    <div className='flex-1 flex flex-col overflow-auto '>
      <ChatHeader />
      <p>Message...</p>
      <ChatInput />
    </div>
  )
}

export default ChatContainer