import { AnyAction } from "redux";
import { setPlayerMic, setPlayerVid } from "../../../chest/utils";
import { INTERACTIONS } from "../../actions/interactions";
import Connection, { Message, IncomingStream } from "../../entities/Connection";





const initialState = {
    instance: null as Connection|null,
    messages: [] as Message[],
    streams: [] as IncomingStream[],
}

export type InteractionsState = typeof initialState;

export default function interactionsReducer ( state: InteractionsState = initialState, action: AnyAction ): InteractionsState {
    const { type, payload } = action;
    let newMessages = [];
    let newStreams = [];
    switch(type) {
        case INTERACTIONS.SET_CONNECTION:
            return {...state, instance: payload.connection}

        case INTERACTIONS.HANG_OUT:
            state.instance?.disconnect();
            return state;

        case INTERACTIONS.SAVE_MESSAGE:
            newMessages = [...state.messages, payload];
            return {...state, messages: newMessages};

        case INTERACTIONS.SAVE_STREAM:
            newStreams = [...state.streams, payload];
            return {...state, streams: newStreams};

        case INTERACTIONS.REMOVE_STREAM:
            newStreams = state.streams.filter(str => str.id !== payload.id );
            return {...state, streams: newStreams};

        case INTERACTIONS.DISCONNECT:
            setPlayerVid(false, state.instance?.stream)
            setPlayerMic(false, state.instance?.stream)
            state.instance?.disconnect();
            return {...state, instance: null}
        default:
            return state;
    }
}