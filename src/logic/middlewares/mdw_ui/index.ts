import type { Middleware, Dispatch, AnyAction, MiddlewareAPI } from "redux";
import { initInteractions, INTERACTIONS, removeStream, saveMessage, saveStream, setConnection } from "../../actions/interactions";
import { ConnectionService, Message, IncomingStream } from "../../entities/Connection";
import { UI } from "../../actions/ui";

export function flow_initialize_connection({ connection }: { connection: ConnectionService}): Middleware<Dispatch> {

    const middleware: Middleware<Dispatch> = ({dispatch}: MiddlewareAPI)=> next=> async(action: AnyAction): Promise<void>=>{
        if (action.type === UI.PAGE_LOADED) {
            try {
                // WHAT
            }catch (err) {
                console.log(err);
            }
        }
        next(action); 
    }
    return middleware;

}