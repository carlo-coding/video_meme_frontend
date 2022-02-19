import { InteractionsState } from "./interactions";
import { GameState } from "./game";
import { UiState } from "./ui";
export default interface State {
    interactions: InteractionsState,
    game: GameState,
    ui: UiState
}