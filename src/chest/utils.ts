export function setPlayerMic(mute: boolean, stream: MediaStream|null|undefined) {
    for (let index in stream?.getAudioTracks()) {
        if(stream) stream.getAudioTracks()[index as any].enabled = mute
    }
}

export function setPlayerVid(closed: boolean, stream: MediaStream|null|undefined) {
    for (let index in stream?.getVideoTracks()) {
        if(stream) stream.getVideoTracks()[index as any].enabled = closed
    }
}