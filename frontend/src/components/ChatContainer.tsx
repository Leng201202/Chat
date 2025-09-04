import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const { messages, getMessages, isLoadingMessages, selectedUser } = useChatStore();
  if(isLoadingMessages) return <div>Loading...</div>
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  return (
    <div className='flex-1 flex flex-col overflow-auto '>
      <ChatHeader />
      <p>Message...</p>
      <ChatInput />
    </div>
  )
}

export default ChatContainer