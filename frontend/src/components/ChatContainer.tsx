import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import userAuthStore from '../store/userAuthStore';
import { formatTimestamp } from '../lib/utils';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages  } = useChatStore();
  const authUser=userAuthStore();
  const messageEndRef = React.useRef<HTMLDivElement | null>(null); 
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return  ()=>unsubscribeFromMessages();
    }
  }, [selectedUser, getMessages, unsubscribeFromMessages, subscribeToMessages]);
  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }
  }, [messages]);
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
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {Array.isArray(messages) ? (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`chat ${message.senderId === authUser.authUser?._id ? 'chat-end' : 'chat-start'}`}
              ref={messageEndRef}
            >
              <div className='chat-image avatar'>
                <div className='rounded-full border size-10'>
                  <img 
                    src={message.senderId === authUser.authUser?._id 
                      ? authUser.authUser?.profilePic || "avatar.jpeg" 
                      : selectedUser?.profilePic || "avatar.jpeg"
                    } 
                    alt='user-profile' 
                  /> 
                </div>
              </div>
              <div className='chat-header mb-1 flex flex-col max-w-[280px] sm:max-w-[320px]'>
                {/* Display time stamp conditionally positioned */}
                <div className={`w-full flex ${message.senderId === authUser.authUser?._id ? 'justify-start ' : 'justify-end px-4'} mb-1`}>
                  <time className="text-xs opacity-50">
                    {formatTimestamp(message.createdAt)}
                  </time>
                </div>
                
                <div className='chat-bubble flex flex-col max-w-[280px] sm:max-w-[320px]'>
                  {message.image && (
                    <img src={message.image} alt="Attachment" className='sm:max-w-[300px] rounded-md mb-2' />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet</div>
        )}
      </div>
      <ChatInput />
    </div>
  )
}

export default ChatContainer