import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import './styles.scss';

const scrollGap = 800;
function autoScroll(elementRef) {
  if (!elementRef) return;
  const { scrollTop, scrollHeight } = elementRef;
  if (scrollTop <= (scrollHeight - scrollGap)) return 
  elementRef.scroll(0, elementRef.scrollHeight);
}

function Chat({ myId, myName, messages, sendMessage, ...props }) {
  const [myMessage, setMyMessage] = useState("");
  const [allMessages, setAllMessages] = useState(messages);
  const chatRef = useRef(null);

  const handleSendMessage = (event)=> {
    event.preventDefault();
    if (!myMessage) return;
    sendMessage(myMessage)
    setMyMessage("");
    setAllMessages(prev=>[...prev, {id: myId, name: myName, message: myMessage, type: "mine"}]);
  }


  useEffect(()=> {
    // Save last message of prop into the chat state
    let lastMessage = messages[messages.length - 1]
    if (!lastMessage) return;
    setAllMessages(prev=>[...prev, {
      id: lastMessage.name, 
      name: lastMessage.name, 
      message: lastMessage.message, 
      type: "friend"}]);
  }, [messages]);

  useEffect(()=>{
    // Autoscroll behaviour on new messages
    autoScroll(chatRef.current)
  }, [allMessages]);


  return (
      <div className='chat-cont'>
        <div className='chat' ref={chatRef}>
          {allMessages.map((msg, index)=> (
            <div key={index} className={`message ${(msg.type==="mine")?"my-message":"friend-message"}`}>
              <span className='username'>{msg.name}</span>
              <span className='text'>{msg.message}</span>
            </div>
          ))}
        </div>
        <form className='user-input' onSubmit={handleSendMessage}>
            <Input 
              {...props}
              name="message"
              placeholder='Mensaje' 
              value={myMessage} 
              onChange={e=>setMyMessage(e.target.value)}
            />
            <Button type='submit'>Enviar Mensaje</Button>
        </form>
      </div>
  )
}



export default Chat
