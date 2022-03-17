import "./styles.scss";
import { memo, useEffect, useRef, useState } from "react";
import Peer, { Instance } from "simple-peer";
import io, { Socket } from "socket.io-client";
import GlobalState from "../../../logic/reducers/GlobalState";
import { connect, useDispatch } from "react-redux";
import Connection, { Message, IncomingStream, NamesInterface } from "../../../logic/entities/Connection";
import { initInteractions } from "../../../logic/actions/interactions";
import { initGame, sendMessage, startGame } from "../../../logic/actions/game";
import Chat from "../../components/Chat";
import Button from "../../components/Button";
import { Mute } from "../../components/CustomIcons/Mute";
import { VideoOff } from "../../components/CustomIcons/VideoOff";
import { BsCameraVideoOff, BsMicMute, BsMic, BsCameraVideo } from "react-icons/bs";
import { setPlayerMic, setPlayerVid } from "../../../chest/utils";
interface Props {
    streams: IncomingStream[],
    messages: Message[],
    myStream: MediaStream|undefined,
    names: NamesInterface,
    roomId: string,
    userName: string,
    connection: Connection|null,
    gameState: string|null,
    playing: any
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
function PeerConnection({ 
    streams, 
    myStream, 
    names, 
    roomId, 
    userName, 
    connection,
    messages,
    gameState,
    playing
 }: Props) {

    const dispatch = useDispatch();

    const [showVideo, setShowVideo] = useState(true);
    const [enableMic, setEnableMic] = useState(true)

    const start = ()=> {
        dispatch(startGame(null))
    }

    const localStream = useRef<MediaStream|null>(null);


    useEffect(()=> {
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream.current = stream;
            dispatch(initInteractions({ userStream: stream, nameSpace: roomId, userName }));
        })
        .catch(err => {
            window.alert("Algo salió mal al intentar acceder a tu cámara");
            console.error(err);
        });
    }, []);

    // Init game every time the connection instance changes
    useEffect(()=>{ if (connection) dispatch(initGame({ namespace: roomId, connection })) }, [connection])

    // Every time playing changes
    useEffect(()=> {
        if (playing && gameState==="playing") {
            setPlayerMic(false, localStream.current);
        }else if (!playing || gameState==="over") {
            setPlayerMic(true, localStream.current);
        }
    }, [playing, gameState])

    const toggleMic = ()=> (setPlayerMic(!enableMic, localStream.current), setEnableMic(!enableMic));
    const toggleVid = ()=> (setPlayerVid(!showVideo, localStream.current), setShowVideo(!showVideo))



    return (
        <div className="room-page">
            <div className="interactions">
                <div className="videos">
                    <UserVideo stream={myStream as MediaStream} username={userName} muted/>
                    {streams.map(strm=> (
                        <UserVideo key={strm.id} stream={strm.stream} username={names[strm.id]}/>
                    ))}
                    {Array((6 - streams.length)).fill(null).map((_,index)=> (
                        <div className="video-placeholder" key={index}></div>
                    ))}
                </div>
                    <Chat 
                        myName={userName}
                        myId={userName}
                        messages={messages}
                        disabled={playing && gameState === "playing"}
                        sendMessage={(message: string)=>dispatch(sendMessage(message))}
                    />
            </div>
            <div className="controls">
                <div>
                    <div>
                        <div className="media-controls">
                            <Button shape="round" onClick={toggleMic}>
                                {enableMic?<BsMic />: <BsMicMute />}
                                
                            </Button>
                            <Button shape="round" onClick={toggleVid}>
                                {showVideo?<BsCameraVideo />: <BsCameraVideoOff />}
                            </Button>
                        </div>
                        {!(gameState==="playing") && (
                            <Button onClick={start}>
                                Iniciar Juego
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

function mapStateToProps (state: GlobalState) {
    return {
        streams: state.interactions.streams,
        myStream: state.interactions.instance?.stream,
        myUsername: state.interactions.instance?.userName,
        names: state.interactions.instance?.names||{},
        connection: state.interactions.instance,
        messages: state.game.messages,
        gameState: state.game.gameState,
        playing: state.game.round?.playing,
    }
}


export default connect(mapStateToProps)(PeerConnection);
