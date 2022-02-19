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

        connection.onNamesChange = (names: NamesInterface)=> {
            this.names = names;
            console.log("[debug] names: ", this.names)
        }

        this.socket.on("game:send-id", ({socket_id})=> {
            this.initAsPlayer();
            this.savePlayer(socket_id);
            if (!this.idSent) {
              this.socket.emit("game:start");
              this.idSent = true;
            }
        });
        this.socket.on("game:time-out", ({ socket_id })=> {
            const timeoutPlayer = this.players.find(player => player.socket_id === socket_id);
            if (timeoutPlayer?.played) return;
            this.playerFinished( socket_id );
            if (this.gameState !== "playing") return;
            if (this.onRoundOver) this.onRoundOver({ name: this.getPlayerName(socket_id) })
            setTimeout(()=>this.nextPlayerStart(false), delay * 1000);
        });
        this.socket.on("game:player-start", ({ socket_id, word, time })=> {
            console.log("[debug] at player-start ", { socket_id, word, time })
            let alreadyPlaying = this.players.find(p=> p.socket_id === socket_id)?.started;
            if (alreadyPlaying) return;

            this.startPlayer( socket_id );

            let playing = this.socket.id === socket_id;
            console.log("[debug] Starting new round")
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
            setTimeout(()=>this.nextPlayerStart(false), delay * 1000);
        });
    
        this.socket.on("game:message", ({ socket_id, message })=> {
            console.log("[debug] getting name by id ", { thisnames: this.names, socket_id, name: this.names[socket_id] })
            if(this.onMessage) this.onMessage({ name: this.names[socket_id], message }); // Mandarlo a una función externa
        })
    }
    start() {
        console.log("[debug] game has started")
        this.gameState = "playing";
        this.socket.emit("game:start");
        this.idSent = true;
        this.initAsPlayer();
        setTimeout(()=>this.nextPlayerStart(true), delay * 1000);
    }
    private endGame () {
        let winner = this.getWinner();
        if(this.onGameover) this.onGameover({ players: this.players, winner });
        this.gameState = null;
        this.currentWord = null;
        this.currentPlayer = null;
        this.players = [];
        this.idSent= false;
        this.moves = 0;
    }
    private nextPlayerStart(firstRound: boolean) {
        if (this.gameState !== "playing") return; 
        let nextPlayer = this.players.find(player => player.played === false);
        if (!nextPlayer) {
          this.endGame();
          return;
        }
        if (this.socket.id === this.currentPlayer?.socket_id) {
            console.log("[degub] emiting player start for new round")
            this.socket.emit("game:player-start", { socket_id: nextPlayer.socket_id } );
        }else if (firstRound) {
            console.log("[degub] emiting player start for FIRST round")
            this.socket.emit("game:player-start", { socket_id: nextPlayer.socket_id } );
        }
        this.moves++;
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
        this.gameState = "playing";
        let playing = this.players.find(player=>player.socket_id === this.socket.id);
        if (playing) return;
        this.savePlayer(this.socket.id)
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
    private getWinner() {
        let maxPoints = Math.max(...this.players.map(({points})=>points));
        let winnerPlayer = this.players.find(player => player.points === maxPoints);
        return this.getPlayerName(winnerPlayer?.socket_id);
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
        console.log("[debug] messages", { message, currentWord: this.currentWord})
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
