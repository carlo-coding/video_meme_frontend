import { ButtonBase } from "@mui/material";
import React from "react";
import { styles_button } from "./styled";


interface Props {
    children?: React.ReactNode,
    shape?: string,
    [x: string]: any,
}

export default function Button({ shape = "", children, ...props }: Props) {
    return (
        <ButtonBase
            {...props}
            sx={styles_button(shape)}
        >
            {children}
        </ButtonBase>
    )
}