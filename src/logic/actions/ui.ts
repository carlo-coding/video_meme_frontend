import React from "react";

export enum UI {
    PAGE_LOADED = "[UI]: PAGE_LOADED",
    SHOW_MODAL = "[UI]: SHOW_MODAL",
    SET_MODAL_CONTENT = "[UI]: SET_MODAL_CONTENT"
}

export const pageLoaded = (payload: { userStream: MediaStream; userName: string; nameSpace: string; })=> ({ type: UI.PAGE_LOADED, payload })

export const showModal = (payload: boolean) => ({type: UI.SHOW_MODAL, payload})

export const setModalContent = (payload: {content: React.ReactNode, title: string, callback?(): void}) => ({type: UI.SET_MODAL_CONTENT, payload})