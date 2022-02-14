import "./styles.css";
import { memo, useEffect, useRef, useState } from "react";
import Peer, { Instance } from "simple-peer";
import io, { Socket } from "socket.io-client";
import Chat from "../Chat";
import GlobalState from "../../../logic/reducers/GlobalState";
import { connect, useDispatch } from "react-redux";
import { Message, IncomingStream, NamesInterface } from "../../../logic/entities/Connection";
import { broadcastMessage, initInteractions } from "../../../logic/actions/interactions";


interface Props {
    streams: IncomingStream[],
    messages: Message[],
    myStream: MediaStream|undefined,
    names: NamesInterface,
    roomId: string,
    userName: string
}

type UserVideoProps = {
    stream: MediaStream, 
    username: string,
    [propName: string]: any
}

const UserVideo = memo(({ stream, username, ...props }: UserVideoProps) => {

    const myVideo = useRef<HTMLVideoElement|null>(null);

    useEffect(()=> {
        if (!myVideo.current) return;
        myVideo.current.srcObject = stream;
    });

    return (
        <div className="user-video">
            <div className="user-name">{username}</div>
            <video ref={myVideo} autoPlay {...props}/>
        </div>
    )
})

const MessageComponent = ({ name, message }: Message)=> {
    
    return (
        <div>
            <span>[{name}]: {message}</span>
        </div>
    )
}
function PeerConnection({ streams, messages, myStream, names, roomId, userName }: Props) {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();


    useEffect(()=> {
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            dispatch(initInteractions({ userStream: stream, nameSpace: roomId, userName }));
        })
        .catch(err => {
            window.alert("Algo salió mal al intentar acceder a tu cámara");
            console.error(err);
        });
    }, []);


    return (
        <div className="peer-main-container">
            <header className="game-header">
                <h1>Video meme</h1>
            </header>
            <div className="videos">
                <UserVideo stream={myStream as MediaStream} username={"julano"} muted/>
                {streams.map(strm=> (
                    <UserVideo key={strm.id} stream={strm.stream} username={names[strm.id]}/>
                ))}
            </div>
            <div className="chat">
                <h3>Chat</h3>
                <div className="messages_container">
                    {messages.map((msg, index)=> (
                        <MessageComponent key={index} {...msg}/>
                    ))}
                </div>
                <div className="send_message">
                    <input 
                        type="text" 
                        placeholder="Ingresa un mensaje" 
                        value={message}
                        onChange={e=>setMessage(e.target.value)}
                    />
                    <button onClick={()=> dispatch(broadcastMessage({ message }))}>Enviar mensaje</button>
                </div>
            </div>
        </div>
    )
};

function mapStateToProps (state: GlobalState) {
    return {
        messages: state.interactions.messages,
        streams: state.interactions.streams,
        myStream: state.interactions.instance?.stream,
        myUsername: state.interactions.instance?.userName,
        names: state.interactions.instance?.names||{},
    }
}


export default connect(mapStateToProps)(PeerConnection);
