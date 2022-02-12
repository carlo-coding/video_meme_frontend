import "./styles.css";
import { useEffect, useRef, useState } from "react";
import Peer, { Instance } from "simple-peer";
import io, { Socket } from "socket.io-client";
import Chat from "../Chat";

// Crear un stream local y ponerlo en video

// Crear la estructura en socket io de mandar, recibir  

interface PeerInterface {
    [id: string]: Instance, 
}

interface NamesInterface {
    [id: string]: string, 
}

interface Props {
    roomId: string,
    userName: string
}

export default function PeerConnection({ roomId, userName }: Props) {

    const myVideo = useRef<HTMLVideoElement|null>(null);
    const videos = useRef<HTMLDivElement|null>(null);
    const myStream = useRef<MediaStream|undefined>(undefined);

    const socket = useRef<Socket|null>(null);
    const peers = useRef<PeerInterface>({});

    const names = useRef<NamesInterface>({});
    const messages = useRef<HTMLDivElement|null>(null);
    const [message, setMessage] = useState("");

    useEffect(()=> {(async ()=> {
        myStream.current = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideo.current) myVideo.current.srcObject = myStream.current;

        socket.current = io(`http://localhost:4057/${roomId}`);
        
        // Comenzar la propagación desde el cliente para poder 
        // Compartir otros metadatos en la inicialización
        socket.current.emit("start-propagation", userName)
        
        // Primero al conectarse mandar a todos los demás mi id para que la guarden 
        
        // Recivir el socket id del que recién se unió y guardarlo
        socket.current.on("start-propagation", ({ socket_id, username }: any)=> {
            console.log("We got the following name: ", username);
            addPeer(socket_id, false, username); 
            socket.current?.emit("respond-propagation", { socket_id, username: userName });
        });

        // Recibir el socket id de quienes responden nuestro llamado
        socket.current.on("respond-propagation", ({ socket_id, username })=> {
            console.log("We got the following name: ", username);
            // guardarlo como receptor
            addPeer(socket_id, true, username);
        })

        // Manejar la desconección del socket local
        socket.current.on("disconnect", ()=> {
            // Remover todos los peers
            for (let user_id in peers.current) {
                removePeer(user_id);
            }
        });

        // Cuando recibamos la señal de otro usuario
        socket.current.on("signal", ({signal, user_id}: any)=> {
            // Al recibir la señal de este usuario, también recibimos su id
            // Usamos este id para encontrar su peer y usamos el metodo signal
            // Para poderlo convertir a stream
            peers.current[user_id].signal(signal);
        })

        // Manejar la desconeccion de otro peer
        socket.current.on("peer-disconnected", (user_id)=> {
            // remover su id de las conexiones
            removePeer(user_id);
        });

        // Manejar mensajes
        socket.current.on("message", ({ socket_id, message}: any)=> {
            createMessage(names.current?.[socket_id]||userName, message);
        })
    })();
    }, []);

    function sendMessage() {
        socket.current?.emit("message", message);
        setMessage("");
    }

    function addPeer(user_id: string, initiator=false, username: string) {
        // we save the name
        names.current[user_id] = username;
        
        peers.current[user_id] = new Peer({
            initiator,
            stream: myStream.current,
            trickle: true
        });

        peers.current[user_id].on("signal", (signal)=> {
            // Le mandamos señal y su propia id al server 
            // Para que este le pueda mandar la señal de regreso al usuario
            socket.current?.emit("signal", {signal, user_id});
        });

        peers.current[user_id].on("stream", (user_stream)=> {
            // Añadir el stream (pendiente)
            addUserStream(user_id, user_stream);
        });
    };

    function createVideo(user_id: string, user_stream: MediaProvider, username: string) {
        const video = document.createElement("video");
        const container = document.createElement("div");
        const name = document.createElement("div");
        
        container.className = "user-video";
        container.id = user_id;
        
        video.autoplay = true;
        video.srcObject = user_stream

        name.textContent = username;
        name.className = "user-name";

        container.appendChild(video);
        container.appendChild(name);

        return container;
    }

    function addUserStream (user_id: string, user_stream: MediaProvider) {
        videos.current?.appendChild(createVideo(user_id, user_stream, names.current[user_id]||""));
    }

    function removePeer(user_id: string) {
        const userVideo = document.getElementById(user_id);
        if (userVideo) videos.current?.removeChild(userVideo);
        // Remove peer
        if (peers.current[user_id]) {
            peers.current[user_id].destroy();
            delete peers.current[user_id];
        }
        // remove name
        delete names.current[user_id];
    }

    function createMessage(sender: string, message: string) {
        const messageCont = document.createElement("div");
        messageCont.className = "user_message";

        const textSpan = document.createElement("span");
        textSpan.className = "message_text";
        textSpan.textContent = message;

        const senderSpan = document.createElement("span");
        senderSpan.className = (sender === userName)? "message-owner" : "message_sender";
        senderSpan.textContent = `[${sender}]: `;

        messageCont.appendChild(senderSpan);
        messageCont.appendChild(textSpan);
        messages.current?.appendChild(messageCont);
    }

    return (
        <div className="peer-main-container">
            <header className="game-header">
                <h1>Video meme</h1>
            </header>
            <div className="videos" ref={videos}>
                <div className="user-video">
                    <div className="user-name">{userName}</div>
                    <video ref={myVideo} autoPlay muted/>
                </div>
            </div>
            <div className="chat">
                <h3>Chat</h3>
                <div className="messages_container" ref={messages}>

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
        </div>
    )
};