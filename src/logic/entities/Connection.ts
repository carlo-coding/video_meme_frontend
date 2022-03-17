import { Instance } from "simple-peer";
import { Socket } from "socket.io-client";

export interface PeersInterface {
    [id: string]: Instance
}

export interface NamesInterface {
    [id: string]: string
}

export type Message = {message: string, name: string}

export type IncomingStream = { stream: MediaStream, id: string }

export default interface Connection {
    socket: Socket|null,
    peers: PeersInterface,
    names: NamesInterface,
    stream: MediaStream|undefined,
    userName: string,
    onStream(incomingStream: IncomingStream): void,
    onRemoveStream(id: string): void,
    onNamesChange(names: NamesInterface): void
    onDisconnection?(reazon: string): void
    disconnect(): void
}

export interface ConnectionService {
    createConnection(params: { userStream: MediaStream, userName: string, nameSpace: string}): Promise<Connection>
}