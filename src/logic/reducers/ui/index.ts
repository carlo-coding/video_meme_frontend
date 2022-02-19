import React from "react";
import { AnyAction } from "redux";
import { UI } from "../../actions/ui";


export interface ModalInterface {
    show: boolean,
    content: React.ReactNode,
    title: string,
    callback?(): void
}

const uiState = {
    modal: {
        show: false,
        content: null as React.ReactNode,
        title: "",
        callback: null as {():void}|null
    } as ModalInterface
}


export type UiState = typeof uiState;

export default function uiReducer(state: UiState = uiState, action: AnyAction): UiState {
    let newModal: any = {};
    switch(action.type) {
        case UI.SHOW_MODAL:
            newModal = {...state.modal, show: action.payload}
            return {...state, modal: newModal};
        case UI.SET_MODAL_CONTENT:
            newModal = {...state.modal, ...action.payload}
            return {...state, modal: newModal};
        default:
            return state;
    }
}