import ConnectionInterface, { IncomingStream, Message, NamesInterface, PeersInterface } from "../../logic/entities/Connection";
import { SERVER_URL } from "../../chest/config";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";


type Params = {
    userStream: MediaStream, 
    userName: string, 
    nameSpace: string,
    onStream(params: IncomingStream): void,
    //onMessage(params: Message): void,
    onRemoveStream(params: string): void,
    onNamesChange(params: NamesInterface): void,
    onDisconnection?(reazon: string): void
}

class Connection implements ConnectionInterface { 
    stream; socket; userName; onStream; /*onMessage;*/ onRemoveStream; onNamesChange; onDisconnection;
    peers: PeersInterface = {};
    names: NamesInterface = {};

    constructor({userStream, userName, nameSpace, onStream, /*onMessage,*/ onRemoveStream, onNamesChange, onDisconnection}: Params) {
        this.socket = io(`${SERVER_URL}${nameSpace}`);
        this.stream = userStream;
        this.userName = userName;
        this.onStream = onStream;
        //this.onMessage = onMessage;
        this.onRemoveStream = onRemoveStream;
        this.onNamesChange = onNamesChange;
        this.onDisconnection = onDisconnection

        // Comenzar la propagación desde el cliente para poder 
        // Compartir otros metadatos en la inicialización
        this.socket.emit("start-propagation", userName);

        // Recivir el socket id del que recién se unió y guardarlo
        this.socket.on("start-propagation", ({ socket_id, username }: any)=> {
            this.addPeer(socket_id, false, username); 
            this.socket?.emit("respond-propagation", { socket_id, username: userName })
        });

        // Recibir el socket id de quienes responden nuestro llamado
        this.socket.on("respond-propagation", ({ socket_id, username })=> {
            // guardarlo como receptor
            this.addPeer(socket_id, true, username);
        });

        // Cuando recibamos la señal de otro usuario
        this.socket.on("signal", ({signal, socket_id}: any)=> {
            // Al recibir la señal de este usuario, también recibimos su id
            // Usamos este id para encontrar su peer y usamos el metodo signal
            // Para poderlo convertir a stream
            this.peers[socket_id].signal(signal);
        });

        // Manejar la desconeccion de otro peer
        this.socket?.on("peer-disconnected", (socket_id)=> {
            // remover su id de las conexiones
            this.removePeer(socket_id);
            this.onRemoveStream(socket_id);
            if(this.onDisconnection)this.onDisconnection("Peer")
        });
        // Manejar la desconección del socket local
        this.socket?.on("disconnect", ()=> {
            // Remover todos los peers
            for (let socket_id in this.peers) {
                this.removePeer(socket_id);
                this.onRemoveStream(socket_id);
            }
            if(this.onDisconnection)this.onDisconnection("Socket")
        });

        // END OF CLASS CONSTRUCTOR :)
    }

    private addPeer(socket_id: string, initiator=false, username: string) {
        const newPeer = new Peer({
            initiator,
            trickle: true,
            stream: this.stream,
        });
        newPeer.on("stream", (stream)=> {
            this.onStream({ stream, id: socket_id })
        });

        newPeer.on("signal", (signal)=> {
            this.socket?.emit("signal", { signal, socket_id })
        });

        // Save peer
        this.peers[socket_id] = newPeer;
        // Save name
        this.names[socket_id] = username;
        this.onNamesChange(this.names);
    }

    private removePeer(socket_id: string) {
        if (this.peers[socket_id]){
            this.peers[socket_id].destroy();
            delete this.peers[socket_id];
            delete this.names[socket_id];
            this.onNamesChange(this.names);
        }
    }

    disconnect(): void {
        this.socket?.disconnect();
    }
}


function createConnection(params: Params) {
    return new Connection(params)
}

export default {
    createConnection
}