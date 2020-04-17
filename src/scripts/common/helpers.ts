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

/**
 * Convert radian angle value into degree.
 * @param {number} canvas Value in radian.
 * @return {number} Converted value.
 */
export function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

/**
 * Convert degree angle value into radian.
 * @param {number} deg Value in degree.
 * @return {number} Converted value.
 */
export function degToRad(deg: number): number {
  return deg * Math.PI / 180;
}
