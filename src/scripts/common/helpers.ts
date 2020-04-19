import { SizeOptions } from '@/types/webworker';
/**
 * Resize canvas element pixels.
 * @param {WebGL2RenderingContext} gl Current WebGL rendering context with canvas which will be resized.
 * @param {SizeOptions} size New options for size.
 * @param {boolean} dpi Optional parameter for HiDPI monitors, default value is true.
 * @return {void}
 */
export function resize({canvas}: WebGL2RenderingContext, size: SizeOptions, dpi = true): void {
  let displayWidth = size.width;
  let displayHeight = size.height;

  if (dpi) {
    const {pixelRatio} = size;
    
    displayWidth  = Math.floor(displayWidth  * pixelRatio);
    displayHeight = Math.floor(displayHeight * pixelRatio);
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
