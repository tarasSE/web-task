import { grayscaleWorker } from "../workers/GrayscaleWorker";

export const imageEncode = (arrayBuffer) => {
    const pixels = new Uint8Array(arrayBuffer);
    let b64encoded = btoa(
        [].reduce.call(
            pixels,
            (p, c) => p + String.fromCharCode(c),
            ""
        )
    );
    let mimetype = "image/jpeg";
    return "data:" + mimetype + ";base64," + b64encoded;
};

export const makeGrayscale = async (image, grayscaleIntensity, canvas) => {
    try {
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        const originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const resultImageData = await grayscaleWorker.postMessage("grayscale", [originalImageData, grayscaleIntensity]);
        context.putImageData(resultImageData, 0, 0);
    }
    catch (e) {
        console.error(e);
    }
}