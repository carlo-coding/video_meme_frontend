import { Socket } from "socket.io-client";
import Connection, { ConnectionService } from "./Connection";


export interface MessageInterface {
    name: string,
    message: string
}

export type GameListener = {(params: any): any}|null

export interface PlayerInterface {
    socket_id: string,
    played: boolean,
    started: boolean,
    points: number,
}

export interface RoundInterface {
    name: string, word: string, time: number, playing: boolean
}

export default interface Game {
    gameState: string|null,
    start(host?: boolean): void,
    sendMessage(message: string): void,
    onMessage: GameListener;
    onGameover: GameListener;
    onNewRound: GameListener;
    onRoundOver: GameListener;
}

export interface GameService {
    createGame({namespace, connection}: {namespace: string, connection: Connection}): Game 
}