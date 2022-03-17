import { Button, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { styles_copyinput } from "./styles";


interface Props {
    copyCb?(): void,
    [x: string]: any
}

export default function Input({ copyCb, ...props }: Props) {

    const inputRef = useRef<HTMLInputElement|null>(null);

    useEffect(()=> {
        inputRef.current?.focus();
    }, []);

    return (
        <OutlinedInput 
            {...props}
            sx={styles_copyinput}
        />
    )
}
