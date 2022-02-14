import "./styles.css";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

function createRoomId () {
    const id = ()=> Math.random().toString().slice(2);
    return `game-${id()}`;
}

enum STAGES {
    ENTER_USER_NAME,
    DECIDE_ROOM
}


function validateRoom(room: string) {
    const regex = /^\game-\d+$/
    return !!room.match(regex)
}

export default function UserInfo() {
    const [,setLocation] = useLocation();
    const [roomId, setRoomId] = useState(createRoomId());
    const [targetRoom, setTargetRoom] = useState("");

    const targetInput = useRef<HTMLInputElement>(null);

    const joinRoom = ()=> {
        if (!validateRoom(targetRoom)) {
            alert("El id de sala no es válido");
            return
        }
        setLocation(`/room/${targetRoom}/`);
    };

    const copyId = ()=> {
        window.navigator.clipboard.writeText(roomId);
        if (targetInput.current) {
            targetInput.current.focus()
            targetInput.current.select()
        }
    }

    
    return (
        <div className="main-container">
            <div className="create-room card">
                <p className="info">
                    Decide entre crear un nuevo juego o unirte a uno con tus amigos
                    o ingresa tu propio código para unirte a tu juego, compartelo 
                    y espera a que se unan
                </p>

                    <div className="input-cont num1">
                        <input
                            value={roomId}
                            onChange={()=>setRoomId(createRoomId())} 
                            placeholder="Crea un nuevo id para tu juego"
                        />
                        <button className="copy-btn" onClick={copyId}>COPY</button>
                    </div>

                    <div className="btn-wrapper num1">
                        <button 
                            className="card-btn"
                            onClick={()=>setRoomId(createRoomId())}
                        >Crear un nuevo id de juego</button>
                    </div>

                    <div className="input-cont num2">
                    <input
                        ref={targetInput}
                        placeholder="Ingresa el id de un juego"
                        value={targetRoom}
                        onChange={(e)=>setTargetRoom(e.target.value)}
                    />
                    </div>
                    <div className="btn-wrapper num2">
                        <button 
                            className="card-btn"
                            onClick={joinRoom}
                        >Unete a un juego con amigos</button>
                    </div>
            </div>
        </div>
    )

}


/* 
<h1 className="room-title">Crear un nuevo juego</h1>
            <button 
                onClick={()=>setRoomId(createRoomId())}
                className="room-btn"
            >Click para nuevo id</button>
            <input type="text" className="room-id" value={roomId}/>

*/