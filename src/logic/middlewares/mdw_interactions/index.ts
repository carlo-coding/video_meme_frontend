import type { Middleware, Dispatch, AnyAction, MiddlewareAPI } from "redux";
import { INTERACTIONS, removeStream, saveMessage, saveStream, setConnection } from "../../actions/interactions";
import { ConnectionService, Message, IncomingStream } from "../../entities/Connection";

export function flow_initialize_connection({ connection }: { connection: ConnectionService}): Middleware<Dispatch> {

    const middleware: Middleware<Dispatch> = ({dispatch}: MiddlewareAPI)=> next=> async(action: AnyAction): Promise<void>=>{
        if (action.type === INTERACTIONS.INIT) {
            try {
                
                const newConnection = await connection.createConnection({...action.payload});
                dispatch(setConnection({ connection: newConnection }));

                newConnection.onMessage = ({message, name}: Message)=> dispatch(saveMessage({ message, name }));
                newConnection.onStream = ({stream, id}: IncomingStream)=> dispatch(saveStream({ stream, id }));
                newConnection.onRemoveStream = (id)=> dispatch(removeStream({ id }));

            }catch (err) {
                console.log(err);
            }
        }
        next(action); 
    }
    return middleware;

}