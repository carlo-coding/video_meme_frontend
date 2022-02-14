import { useEffect, useState } from "react";



export default function Chat ({ socket, names }: any) {
    const [message, setMessage] = useState("");

    useEffect(()=> {
        socket?.on("message", ({ socket_id, message }: any)=> {
            console.log("We got a message from ", names?.[socket_id]);
            console.log(message);
        })
    }, []);

    function sendMessage() {
        console.log("Tratando de mandar un mensaje" , message)
        console.log("socket: " , socket)
        socket?.emit("message", message);
    }


    return (
        <div>
            <div className="messages_container">

            </div>
            <div className="send_message">
                <input 
                    type="text" 
                    placeholder="Ingresa un mensaje" 
                    value={message}
                    onChange={e=>setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Enviar mensaje</button>
            </div>
        </div>
    )
}