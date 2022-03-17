import { connect, useDispatch } from "react-redux"
import GlobalState from "../../../logic/reducers/GlobalState";
import { ModalInterface } from "../../../logic/reducers/ui"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { showModal } from "../../../logic/actions/ui";
import { useEffect } from "react";
import { SxProps } from "@mui/material";

interface Props {
    modal: ModalInterface,
    gameState: string
}

const style: SxProps = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    textAlign: "center",
    p: 1,
    ".snackbar-title":
    {
        fontSize: "1.2rem",
        fontWeight: "500" 
    }
};


function Snackbar ({ modal, gameState }: Props) {
    const dispatch = useDispatch();

    useEffect(()=>{
        if (gameState !== "over") return
        const timeout = setTimeout(()=>dispatch(showModal(false)), 3000);
        return ()=> clearTimeout(timeout);
    }, [gameState]);

    return (
            <Box
                sx={{
                    display: modal.show? "flex" : "none",
                    alignItems: "center",
                    position: "relative",
                    background: "var(--clr-main-dark)",
                    border: "1px solid var(--clr-main-purple)",
                    color: "var(--clr-main-clear)",
                    padding: "1em",
                    ".close-icon": {
                        position: "absolute",
                        right: "20px",
                        top: "calc(50% - 0.8em)",
                        cursor: "pointer",
                    },
                }}
            >
                <Box sx={style}>
                    <p className="snackbar-title">{modal.title}</p>
                    <p>{modal.content}</p>
                </Box>
                <p className="close-icon" onClick={()=>dispatch(showModal(false))}>
                    Cerrar
                </p>
            </Box>
    )
}



function mapStateToProps (state: GlobalState) {
    return {
        modal: state.ui.modal,
        gameState: state.game.gameState
    }
}

export default connect(mapStateToProps)(Snackbar)