/**
 * Resize canvas element pixels.
 * @param {HTMLCanvasElement} canvas The canvas which will be resized.
 * @param {boolean} dpi Optional parameter for HDDPI monitors, default value is true.
 * @return {void}
 */
export function resizeCanvas(canvas: HTMLCanvasElement, dpi = true): void {
  let displayWidth = canvas.clientWidth;
  let displayHeight = canvas.clientHeight;

  if (dpi) {
    const realToCSSPixels = window.devicePixelRatio;

    displayWidth  = Math.floor(displayWidth  * realToCSSPixels);
    displayHeight = Math.floor(displayHeight * realToCSSPixels);
  }
 
  if (canvas.width != displayWidth)
    canvas.width  = displayWidth;

  if (canvas.height != displayWidth)
    canvas.height = displayHeight;
}
