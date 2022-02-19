import Connection from "../entities/Connection";
import Game, { MessageInterface, PlayerInterface } from "../entities/Game";

export enum GAME {
    INIT_GAME = "[GAME_ACTIONS]: INIT_GAME",
    SET_GAME = "[GAME_ACTIONS]: SET_GAME",
    START_GAME = "[GAME_ACTIONS]: START_GAME",
    SEND_MESSAGE = "[GAME_ACTIONS]: SEND_MESSAGE",
    SAVE_MESSAGE = "[GAME_ACTIONS]: SAVE_MESSAGE",
    GAME_OVER = "[GAME_ACTIONS]: GAME_OVER",
    NEW_ROUND = "[GAME_ACTIONS]: NEW_ROUND",
    ROUND_OVER = "[GAME_ACTIONS]: ROUND_OVER",
}


export const initGame = (payload: {namespace: string, connection: Connection})=> ({ type: GAME.INIT_GAME, payload });

export const setGame = (payload: Game ) => ({ type: GAME.SET_GAME, payload })

export const startGame = (payload: any)=> ({ type: GAME.START_GAME, payload });

export const sendMessage = (payload: string)=> ({ type: GAME.SEND_MESSAGE, payload });

export const saveMessage = (payload: MessageInterface) => ({ type: GAME.SAVE_MESSAGE, payload });

export const gameOver = (payload: { players: Array<PlayerInterface>, winner: PlayerInterface }) => ({ type: GAME.GAME_OVER, payload });

export const newRound = (payload: any)=> ({ type: GAME.NEW_ROUND, payload });

export const roundOver = (payload: any)=> ({ type: GAME.ROUND_OVER, payload }) 
