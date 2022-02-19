import React, { useEffect, useRef, useState } from 'react';
import './styles.css';


function Chat({ myId, myName, messages, sendMessage }) {
  const [myMessage, setMyMessage] = useState("");
  const [allMessages, setAllMessages] = useState(messages);
  const scrollGap = 800;
  const chatRef = useRef(null);

  const handleSendMessage = (event)=> {
    event.preventDefault();
    if (!myMessage) return;
    sendMessage(myMessage)
    setMyMessage("");
    setAllMessages(prev=>[...prev, {id: myId, name: myName, message: myMessage, type: "mine"}]);
  }


  useEffect(()=> {
    const { scrollTop, scrollHeight } = chatRef.current;
    if (scrollTop <= (scrollHeight - scrollGap)) return 
    chatRef.current.scroll(0, chatRef.current.scrollHeight);

    let lastMessage = messages[messages.length - 1]
    if (!lastMessage) return;
    setAllMessages(prev=>[...prev, {
      id: lastMessage.name, 
      name: lastMessage.name, 
      message: lastMessage.message, 
      type: "friend"}]);
  }, [messages]);


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
            <input 
              placeholder='Ingresa un mensaje'
              name="message" 
              value={myMessage} 
              onChange={e=>setMyMessage(e.target.value)}
            />
            <button type='submit'>Enviar Mensaje</button>
        </form>
      </div>
  )
}



export default Chat
