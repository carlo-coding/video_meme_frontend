import "./styles.scss";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import CopyInput from "../../components/CopyInput";
import Button from "../../components/Button";
function createRoomURL () {
    const id = ()=> Math.random().toString().slice(2);
    return `${window.location.origin}/room/gvideo-${id()}`;
}

enum STAGES {
    ENTER_USER_NAME,
    DECIDE_ROOM
}


function validateRoom(room: string) {
    const regex = /^\gvideo-\w+$/
    return !!room.match(regex)
}

export default function UserInfo() {
    const [,setLocation] = useLocation();
    const [roomURL, setRoomURL] = useState(createRoomURL());
    const [targetRoom, setTargetRoom] = useState("");


    const targetInput = useRef<HTMLInputElement>(null);

    const joinRoom = ()=> {
        if (!validateRoom(targetRoom)) {
            alert("El id de sala no es válido");
            return
        }
        setLocation(`/room/${targetRoom}/`);
    };

    const copyURL = ()=> {
        window.navigator.clipboard.writeText(roomURL);
        if (targetInput.current) {
            targetInput.current.focus()
            targetInput.current.select()
        }
    }

    const copyAndRedirect = ()=> {
        copyURL();
        setLocation(roomURL)   
    }

    
    return (
        <div className="main-container">
            <div className="logo"></div>
            <p className="info-game">
                    Decide entre crear un nuevo juego o unirte a uno con tus amigos
                    o ingresa tu propio código para unirte a tu juego, compartelo 
                    y espera a que se unan
                </p>
            <div className="create-room-card">
                <p className="info-url">
                Comparte este enlace con las personas que quieres que se unan al juego y has click para unirte.
                </p>

                <div className="input-cont num1">
                    <CopyInput
                        copyCb={copyURL}
                        value={roomURL}
                        onChange={()=>setRoomURL(createRoomURL())} 
                        placeholder="Crea un nuevo id para tu juego"
                    />
                </div>

                <div className="btn-wrapper num1">
                    <Button
                        className="card-btn"
                        onClick={copyAndRedirect}
                    >Ir y copiar url</Button>
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