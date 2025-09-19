// Rescale image to DOWNSCALED x DOWNSCALED while maintaining aspect ratio.
// Pad with black bars if necessary.
export function rescaleImage(image: HTMLImageElement | HTMLCanvasElement, DOWNSCALED: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");
    const aspect = image.width / image.height;
    let newWidth, newHeight;
    if (aspect > 1) {
        // Landscape orientation
        newWidth = DOWNSCALED;
        newHeight = DOWNSCALED / aspect;
    } else {
        // Portrait orientation
        newWidth = DOWNSCALED * aspect;
        newHeight = DOWNSCALED;
    }
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    return canvas;
}