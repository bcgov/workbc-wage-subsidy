import { Buffer } from "buffer"

export const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const buffer = Buffer.from(b64Data, "base64")
    const blob = new Blob([buffer.buffer], { type: contentType })
    return blob
}

export const downloadPdf = (buffer, filename) => {
    const blob = b64toBlob(buffer, "application/pdf")
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    if (link?.parentNode) {
        link.parentNode.removeChild(link)
    }
}
