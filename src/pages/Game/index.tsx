import "./styles.css";
import React, { useState, } from "react";
import { useRoute } from "wouter";
import PeerConnection from "../PeerConnection";

enum STAGES {
    ENTER_USER_NAME,
    START_GAME,
}

function valid(name: string) {
    return !!name;
}

export default function Game() {
    const [currentStage, setCurrentStage] = useState(STAGES.ENTER_USER_NAME);
    const [name, setName] = useState("");
    const [,params] = useRoute("/room/:id");

    function handleStartGame() {
        if (!valid(name)) {
            alert("Ingresa un nombre válido");
            return;
        };
        setCurrentStage(STAGES.START_GAME)
    }

    switch(currentStage) {
        case STAGES.ENTER_USER_NAME:
            return (
                <div className="name_form">
                    <h3>Ingresa tu nombre</h3>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
                    <button onClick={handleStartGame}>Continuar al juego</button>

                    <div className="game-info">
                    <p>
                    cuando sea tu turno, te daremos una palabra aleatoria y debes interpretarla 
                    para que el resto la pueda adivinar, así que no prodrás hablar y tendrás
                    un tiempo límite.
                    </p>

                    <p>
                    Si la adivinan tienes 6 puntos y quien la adivine tiene 4.
                    Al final quien tenga más puntos gana.
                    </p>

                    <p>
                    Para adivinarla sólo debes escribirla en el chat 
                    y si aciertas ganas 4 puntos
                    </p>

                    <p>
                    El unico que puede iniciar el juego es anfitrión
                    </p>
                    </div>
                </div>
            );
        case STAGES.START_GAME:
            return (
                <div className="start_game">
                    {params && <>
                        <PeerConnection roomId={params.id} userName={name}/>
                    </>}
                </div>
            )
    }
}