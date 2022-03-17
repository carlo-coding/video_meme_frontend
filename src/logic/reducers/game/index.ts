import { AnyAction } from "redux";
import { GAME } from "../../actions/game";
import Game, { MessageInterface, PlayerInterface, RoundInterface } from "../../entities/Game";

type gameStateType = "playing"|"over"|"paused"

const gameState = {
    instance: null as Game|null,
    round: null as RoundInterface|null,
    winners: null as PlayerInterface[]|null,
    messages: [] as Array<MessageInterface>,
    nameOfLastPlayer: "",
    gameState: "over" as gameStateType
}

export type GameState = typeof gameState; 

export default function gameReducer(state: GameState = gameState, action: AnyAction): GameState {
    let newMessages = [];
    console.log(action.type);
    switch(action.type) {
        case GAME.SAVE_MESSAGE:
            // save the message
            newMessages = [...state.messages, action.payload];
            return {...state, messages: newMessages};
        case GAME.GAME_OVER:
            // Save data related to game over
            return {...state, winners: action.payload.winners, gameState: "over"};
        case GAME.NEW_ROUND:
            // Save data related to new round
            return {...state, round: action.payload, gameState: "playing"}
        case GAME.ROUND_OVER:
            // Save data
            return {...state, nameOfLastPlayer: action.payload.name};
        case GAME.SEND_MESSAGE:
            // should be sending only string
            // but its sending { name, message }
            // Usa el game para mandar el mensaje
            state.instance?.sendMessage(action.payload);
            return state;
        case GAME.SET_GAME:
            // Establece el juego en el estado
            return {...state, instance: action.payload};
        case GAME.START_GAME:
            // Usa la instancia del juego en el estado para iniciar un nuevo juego
            state.instance?.start();
            return {...state, gameState: "playing"};
        default:
            return state;

    }
} 