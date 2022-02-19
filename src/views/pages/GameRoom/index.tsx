import { memo, useEffect, useRef, useState } from "react";
import Peer, { Instance } from "simple-peer";
import io, { Socket } from "socket.io-client";
import GlobalState from "../../../logic/reducers/GlobalState";
import { connect, useDispatch } from "react-redux";
import Connection, { Message, IncomingStream, NamesInterface } from "../../../logic/entities/Connection";
import { broadcastMessage, initInteractions } from "../../../logic/actions/interactions";
import { initGame, sendMessage, startGame } from "../../../logic/actions/game";
import Chat from "../../components/Chat";
import { Button, Box } from "@mui/material";

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
        if (playing) {
            setPlayerMic(false);
            return;
        }
        setPlayerMic(true);
    }, [playing])

    function setPlayerMic(mute: boolean) {
        for (let index in localStream.current?.getAudioTracks()) {
            if(localStream.current) localStream.current.getAudioTracks()[index as any].enabled = mute
        }
    }

    return (
        <Box sx={{
            gridTemplate: `
                "header header header"
            `,
            ["& .videos"]: {
                display: "grid",
                gridTemplateColumns: "repeat(3, 200px)",
                gridTemplateRows: "repeat(2, 200px)",
            },
            ["& .user-video"]: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "relative",
                ["& video"]: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                },
                ["& .user-name"]: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    padding: "0.2em 0.6em",
                    color: "#FFF",
                    background: "rgb(158, 158, 158)",
                    borderRadius: "5px",
                }
            },
            ["& .interactions"]: {
                display: "flex",
                justifyContent: "space-evenly"
            }
        }}>
            <header className="game-header">
                <h1>Video meme</h1>
            </header>
            <div className="interactions">
                <div className="videos">
                    <UserVideo stream={myStream as MediaStream} username={userName} muted/>
                    {streams.map(strm=> (
                        <UserVideo key={strm.id} stream={strm.stream} username={names[strm.id]}/>
                    ))}
                </div>
                    <Chat 
                        myName={userName}
                        myId={userName}
                        messages={messages}
                        sendMessage={(message: string)=>dispatch(sendMessage(message))}
                    />
            </div>
            {!(gameState==="playing") && <Button onClick={start} variant="contained" className="start-btn">Iniciar Juego</Button>}
        </Box>
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
        gameState: state.game.instance?.gameState||null,
        playing: state.game.round?.playing,
    }
}


export default connect(mapStateToProps)(PeerConnection);
