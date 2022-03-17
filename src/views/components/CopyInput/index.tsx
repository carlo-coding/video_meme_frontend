import { Button, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { styles_copyinput } from "./styles";


interface Props {
    copyCb?(): void,
    [x: string]: any
}

export default function CopyInput({ copyCb, ...props }: Props) {

    const inputRef = useRef<HTMLInputElement|null>(null);

    useEffect(()=> {
        inputRef.current?.focus();
    }, []);

    return (
        <OutlinedInput 
            {...props}
            sx={styles_copyinput}
            endAdornment={
                <InputAdornment position="end" onClick={copyCb}>
                    <CopyIcon />
                </InputAdornment>
            }
        />
    )
}


const CopyIcon = ()=> (
    <svg width="20" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="path-1-inside-1_10_17" fill="white">
    <path d="M0 4.37839H2.54545V24.446H22.9091V27H0V4.37839Z"/>
    </mask>
    <path d="M0 4.37839V1.37839H-3V4.37839H0ZM2.54545 24.446H-0.454546V27.446H2.54545V24.446ZM22.9091 27V30H25.9091V27H22.9091ZM0 27H-3V30H0V27ZM2.54545 4.37839H5.54545V1.37839H2.54545V4.37839ZM22.9091 24.446H25.9091V21.446H22.9091V24.446ZM22.9091 24H0V30H22.9091V24ZM3 27V4.37839H-3V27H3ZM0 7.37839H2.54545V1.37839H0V7.37839ZM-0.454546 4.37839V24.446H5.54545V4.37839H-0.454546ZM2.54545 27.446H22.9091V21.446H2.54545V27.446ZM19.9091 24.446V27H25.9091V24.446H19.9091Z" fill="white" mask="url(#path-1-inside-1_10_17)"/>
    <rect x="6.59091" y="1.5" width="19.9091" height="19.6216" stroke="white" stroke-width="3"/>
    <mask id="path-4-inside-2_10_17" fill="white">
    <path d="M0 4.37839H2.54545V24.446H22.9091V27H0V4.37839Z"/>
    </mask>
    <path d="M0 4.37839V1.37839H-3V4.37839H0ZM2.54545 24.446H-0.454546V27.446H2.54545V24.446ZM22.9091 27V30H25.9091V27H22.9091ZM0 27H-3V30H0V27ZM2.54545 4.37839H5.54545V1.37839H2.54545V4.37839ZM22.9091 24.446H25.9091V21.446H22.9091V24.446ZM22.9091 24H0V30H22.9091V24ZM3 27V4.37839H-3V27H3ZM0 7.37839H2.54545V1.37839H0V7.37839ZM-0.454546 4.37839V24.446H5.54545V4.37839H-0.454546ZM2.54545 27.446H22.9091V21.446H2.54545V27.446ZM19.9091 24.446V27H25.9091V24.446H19.9091Z" fill="white" mask="url(#path-4-inside-2_10_17)"/>
    <rect x="6.59091" y="1.5" width="19.9091" height="19.6216" stroke="white" stroke-width="3"/>
    </svg>
)