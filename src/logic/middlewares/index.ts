import {
    flow_initialize_connection
} from "./mdw_interactions";

import {
    flow_initialize_game
} from "./mdw_game";

export default [
    flow_initialize_connection,
    flow_initialize_game
]