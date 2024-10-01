

function Base64ToURL(base64) {
    let byteString = atob(base64)
    let byteArray  = new Uint8Array(byteString.length)

    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([byteArray], { type: "application/octect-stream" })
    let url = URL.createObjectURL(blob);
    return url;
}

function FromDateToString(date) {
    return date.toDateString();
}






export { Base64ToURL, FromDateToString }