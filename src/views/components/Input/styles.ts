import { SxProps } from "@mui/material";




export const styles_copyinput: SxProps = {
    paddingRight: "0.5em !important",
    width: "100%",
    "&":
        {
            border: "1px solid var(--clr-main-purple)",
            color: "var(--clr-main-clear)",
            background: "rgba(95, 29, 140, 0.12)",
            "& *, *:hover, *:focus, *:active": {
                border: "none !important", outline: "none !important"
            }
        },
    ".MuiInputBase-input":
    {
        padding: "0.7em",
        paddingRight: "0.1em !important"
    },
    ".MuiInputAdornment-root":
    {
        cursor: "pointer"
    }
}