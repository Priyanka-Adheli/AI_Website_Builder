import React, { useRef } from 'react'

const ChatPanel = ({messages,onSend,loading}) => {

    const bottomRef = useRef(null);

    useEffect(()=>{
        bottomRef?.current?.scrollIntoView({behavior:"auto"});
    },[messages,loading])
  return (
    <div className='flex flex-col h-full bg-white'>
        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar'>

        </div>
        {/* Input */}
    </div>
  )
}

export default ChatPanel