import Connection from "../entities/Connection";

export enum INTERACTIONS {
    INIT = "[INTERACTIONS]: INIT",
    SAVE_MESSAGE = "[INTERACTIONS]: SAVE_MESSAGE",
    SAVE_STREAM = "[INTERACTIONS]: SAVE_STREAM",
    SET_CONNECTION = "[INTERACTIONS]: SET_CONNECTION",
    HANG_OUT = "[INTERACTIONS]: HANG_OUT",
    REMOVE_STREAM = "[INTERACTIONS]: REMOVE_STREAM",
    BROADCAST_MESSAGE = "[INTERACTIONS]: BROADCAST_MESSAGE"
}


export const saveMessage = (payload: { message: string, name: string })=> ({ type: INTERACTIONS.SAVE_MESSAGE, payload });

export const saveStream = (payload: {stream: MediaStream, id: string })=> ({ type: INTERACTIONS.SAVE_STREAM, payload });

export const setConnection = (payload: { connection: Connection }) => ({ type: INTERACTIONS.SET_CONNECTION, payload});

export const initInteractions = (payload: { userStream: MediaStream, userName: string, nameSpace: string}) =>({ type: INTERACTIONS.INIT, payload });

export const hangOut = ()=> ({type: INTERACTIONS.HANG_OUT});

export const removeStream = (payload: {id: string})=> ({type: INTERACTIONS.REMOVE_STREAM, payload});

export const broadcastMessage = (payload: { message: string })=> ({ type: INTERACTIONS.BROADCAST_MESSAGE, payload })
