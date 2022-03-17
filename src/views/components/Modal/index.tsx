import { Modal, Box, SxProps } from "@mui/material"
import React from "react"



const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "min(70%, 600px)",
    bgcolor: 'var(--clr-main-dark)',
    color: "var(--clr-main-clear)",
    boxShadow: 24,
    p: 5,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
    lineHeight: 1.7,

    "> .close-button":
    {
        background: "inherit",
        color: "currentColor",
        border: "none",
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    }
};

interface Props {
    open: boolean,
    setOpen(param: boolean): void,
    children?: React.ReactNode
}

export default function CustomModal({ open, setOpen, children }: Props) {


    const close = ()=> setOpen(false)
    
    return(
        <Modal  
            open={open}
            onClose={close}
        >
            <Box sx={style}>
                <button className="close-button" onClick={close}>X</button>
                {children}
            </Box>
        </Modal>
    )

}