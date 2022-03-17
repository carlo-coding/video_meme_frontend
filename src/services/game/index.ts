import io, { Socket } from "socket.io-client";
import GameInterface, { MessageInterface as GameMessageInterface, PlayerInterface, GameListener} from "../../logic/entities/Game";
import { SERVER_URL } from "../../chest/config";
import Connection, { NamesInterface } from "../../logic/entities/Connection";

function compareWords(str1: string, str2: string) {
    if (str1.toUpperCase() === str2.toUpperCase()) return true;
    return false;
}

enum POINTS  {
    GUESSED = 4,
    PLAYED = 7
}
const delay = 2;

class GuessWord implements GameInterface{
    gameState: string|null; 
    private socket: Socket;
    private messages: Array<GameMessageInterface>; 
    private currentWord: string|null; 
    private currentPlayer: PlayerInterface|null;
    private idSent: boolean; 
    private moves: number; 
    private names: NamesInterface;
    private players: Array<PlayerInterface>;
    private userName: string;
    private host: boolean;

    onMessage: GameListener = null;
    onGameover: GameListener = null;
    onNewRound: GameListener = null;
    onRoundOver: GameListener = null;
    
    constructor(namespace: string, connection: Connection) {
        this.socket = connection.socket as Socket;
        this.userName = connection.userName;

        this.gameState = null;
        this.currentWord = null;
        this.currentPlayer = null;
        this.idSent = false;
        this.moves = 0;
        this.players = [];
        this.names = {};
        this.messages = [];
        this.host = false;

        connection.onNamesChange = (names: NamesInterface)=> {
            this.names = names;
        }

        connection.onDisconnection = (reazon)=> {
            this.endGame(reazon);
        }

        this.socket.on("game:send-id", ({socket_id})=> {
            this.savePlayer(socket_id);
            this.start(false); // Emitir game:start pero sin ser el host
        });
        this.socket.on("game:time-out", ({ socket_id })=> {
            const timeoutPlayer = this.players.find(player => player.socket_id === socket_id);
            if (timeoutPlayer?.played) return;
            this.playerFinished( socket_id );
            if (this.gameState !== "playing") return;
            if (this.onRoundOver) this.onRoundOver({ name: this.getPlayerName(socket_id) })
            this.nextPlayerStart();
        });
        this.socket.on("game:player-start", ({ socket_id, word, time })=> {
            let alreadyPlaying = this.players.find(p=> p.socket_id === socket_id)?.started;
            if (alreadyPlaying) return;

            this.startPlayer( socket_id );

            let playing = this.socket.id === socket_id;
            if(this.onNewRound) this.onNewRound({ name: this.names[socket_id], word, time, playing });
            this.currentPlayer = this.players.find(player=>player.socket_id === socket_id)||null;
            this.currentWord = word;
        });

        this.socket.on("game:user-guessed", ({ roundWinners, prevPlayer })=> {
            for (let { socket_id, points } of roundWinners) {
                this.assignPoints(socket_id, points);
            }
            this.playerFinished( prevPlayer.socket_id );
            if(this.onRoundOver) this.onRoundOver({ name: this.getPlayerName(prevPlayer.socket_id) })
            this.nextPlayerStart();
        });
    
        this.socket.on("game:message", ({ socket_id, message })=> {
            if(this.onMessage) this.onMessage({ name: this.names[socket_id], message }); // Mandarlo a una función externa
        });

        // On gameover 
        this.socket.on("game:gameover", ()=> {
            this.endGame();
        })
    }
    start(host=true) {
        if (this.idSent) return;

        this.gameState = "playing";
        this.idSent = true;
        this.host = host;

        this.initAsPlayer();
        this.socket.emit("game:start");
        this.nextPlayerStart();
    }
    private endGame (reazon?: string) {
        if (this.gameState !== "playing") return;
        let winners = this.getWinners();
        if(this.onGameover) this.onGameover({ players: this.players, winners, reazon });
        this.gameState = null;
        this.currentWord = null;
        this.currentPlayer = null;
        this.players = [];
        this.idSent= false;
        this.moves = 0;
        this.host = false;
    }
    private nextPlayerStart() {
        if (!this.host) return // Sólo el host ejecuta está lógica
        if (this.gameState !== "playing") return; 
        setTimeout(()=>{
            let nextPlayer = this.players.find(player => player.played === false);
            if (!nextPlayer) {
                this.socket.emit("game:gameover")
                return;
            }
            this.socket.emit("game:player-start", { socket_id: nextPlayer.socket_id } );
            this.moves++;
        },  delay * 1000 )
    }
    private savePlayer(socket_id: string) {
        this.players = [...this.players, {
            socket_id,
            played: false,
            started: false,
            points: 0,
        }];
    }
    private initAsPlayer() {
        let currently_a_player = !!(this.players.find(player=>player.socket_id === this.socket.id));
        if (!currently_a_player) this.savePlayer(this.socket.id)
    }
    private assignPoints (socket_id: string, points: number) {
        this.players = this.players.map(player => {
            if (player.socket_id === socket_id) {
            return {...player, points: player.points + points}
            };
            return player;
        })
    }
    private playerFinished ( socket_id: string ) {
        this.players = this.players.map(player => {
            if (player.socket_id === socket_id) {
            return {...player, played: true};
            }
            return player;
        });
    }
    private startPlayer( socket_id: string ){
        this.players = this.players.map(player => {
            if (player.socket_id === socket_id) {
                return {...player, started: true};
            }
            return player;
        });
    }
    private getWinners() {
        let maxPoints = Math.max(...this.players.map(({points})=>points));
        let winnerPlayers = this.players.filter(player => player.points === maxPoints);
        if (maxPoints === 0) return null;
        return winnerPlayers.map(pl=>this.getPlayerName(pl.socket_id))
    }

    private getPlayerName(socket_id: any) {
        let name = this.names[socket_id]
        ? this.names[socket_id] 
        :(this.socket.id === socket_id)
        ? this.userName
        :null;
        return name;  
    }

    sendMessage(message: string) {
        if (message && typeof message === "string") this.socket.emit("game:message", message);

        if(this.gameState !== "playing") return;
        if (this.currentWord && !compareWords(message, this.currentWord)) return;

        const data = { roundWinners: [
            { socket_id: this.socket.id, points: POINTS.GUESSED },
            { socket_id: this.currentPlayer?.socket_id, points: POINTS.PLAYED }
        ], prevPlayer: this.currentPlayer };
        
        this.socket.emit("game:user-guessed", data);
    }
}

function createGame({namespace, connection}: {namespace: string, connection: Connection}) {
    const gameNamespace = namespace.replace("gvideo", "game");
    return new GuessWord(gameNamespace, connection);
}

export default {
    createGame
}

// [pending] Manejar server timeout cuando se crean nuevas partidas, porque se reinicia el players array
