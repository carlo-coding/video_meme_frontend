import { Box } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "wouter"
import { disconnect } from "../../../logic/actions/interactions"
import Button from "../Button"
import CustomModal from "../Modal"
import Snackbar from "../Snackbar"
import "./styles.scss"


interface Props {
    children?: React.ReactNode,
    [x: string]: any
}

export default function Layout({ children }: Props) {

    const [path,setLocation] = useLocation();
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false);

    useEffect(()=> {
        if (path === "/") dispatch(disconnect())
    }, [path])

    return (
        <div className="main-layout">
            <Snackbar />
            {children}
            <CustomModal 
                open={openModal}
                setOpen={setOpenModal}
            >
                <h2>Reglas del juego</h2>
                <p>
                    Cuando sea tu turno, te daremos una palabra aleatoria y debes interpretarla para que el resto la pueda adivinar, así que no prodrás hablar y tendrás un tiempo límite.
                    Si la adivinan tienes 6 puntos y quien la adivine tiene 4. Al final quien tenga más puntos gana.
                    Para adivinarla sólo debes escribirla en el chat y si aciertas ganas 4 puntos
                    El unico que puede iniciar el juego es anfitrión.
                </p>
            </CustomModal>

            <div className="menu-buttons">
                {(path !== "/") && (
                    <Button onClick={()=>setLocation("/")} shape="round,medium">
                        Inicio
                    </Button>
                )}
                <Button onClick={()=>setOpenModal(true)} shape="round,medium">
                    Reglas
                </Button>
            </div>
        </div>
    )
}

