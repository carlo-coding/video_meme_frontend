import "./styles.scss";
import React, { FormEvent, useState, } from "react";
import { useRoute } from "wouter";
import GameRoom from "../GameRoom";
import Input from "../../components/Input";
import Button from "../../components/Button";

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

    function handleStartGame(e: FormEvent) {
        e.preventDefault();
        if (!valid(name)) {
            alert("Ingresa un nombre válido");
            return;
        };
        setCurrentStage(STAGES.START_GAME)
    }

    switch(currentStage) {
        case STAGES.ENTER_USER_NAME:
            return (
                <div className="get-name-page">
                    <div className="form-container">
                    <h2>Ingresa un nombre para entrar al juego.</h2>
                        <form className="name_form" onSubmit={handleStartGame}>
                            <Input 
                                type="text" 
                                value={name} 
                                placeholder="Nombre de jugador"
                                onChange={(e: any)=>setName(e.target?.value)}
                            />
                            <Button type="submit">Continuar al juego</Button>
                        </form>
                    </div>
                </div>
            );
        case STAGES.START_GAME:
            return (
                <div className="start_game">
                    {params && <>
                        <GameRoom roomId={params.id} userName={name}/>
                    </>}
                </div>
            )
    }
}



/* 
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

*/