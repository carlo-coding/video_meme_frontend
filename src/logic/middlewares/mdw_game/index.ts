import type { Middleware, Dispatch, AnyAction, MiddlewareAPI } from "redux";
import { GameService } from "../../entities/Game";
import { GAME, gameOver, setGame, saveMessage, newRound, roundOver } from "../../actions/game";
import { setModalContent, showModal } from "../../actions/ui";

export function flow_initialize_game({ guessWord }: { guessWord: GameService}): Middleware<Dispatch> {

    const middleware: Middleware<Dispatch> = ({dispatch}: MiddlewareAPI)=> next=> async(action: AnyAction): Promise<void>=>{
        if (action.type === GAME.INIT_GAME) {
            try {
                const showModal = dispatchModal(dispatch);

                const game = guessWord.createGame(action.payload);
                dispatch(setGame(game));

                game.onGameover = ({ players, winner })=> {
                    dispatch(gameOver({ players, winner }));
                    let content = winner? `El ganador fue ${winner}` : "Nadie ganó"
                    showModal("El juego terminó", content)
                };

                game.onMessage = ({ name, message }) => dispatch(saveMessage({ name, message }));

                game.onNewRound = ({ name, word, time, playing }) => {
                    dispatch(newRound({ name, word, time, playing }));
                    let content = playing
                    ? `Es tu turno, debes interpretar la siguiente palabra: ${word} tienes ${time} segundos` 
                    : `El jugador es ${name} tienes ${time} segundos para adivinar`;
                    showModal("Nueva ronda", content)
                }
                
                game.onRoundOver = ({ name }) => {
                    dispatch(roundOver({ name }));
                    showModal("La ronda terminó", `Ha terminado el turno de ${name}`)
                };

            }catch (err) {
                console.log(err);
            }
        }
        next(action); 
    }
    return middleware;

}

function dispatchModal(dispatch: Dispatch<AnyAction>) {
    return function (title: string, content: string) {
        dispatch(setModalContent({title, content}))
        dispatch(showModal(true))
    }
}