/**
 * Get GL context.
 * @param {HTMLCanvasElement} canvas The canvas which context is taken.
 * @return {WebGL2RenderingContext} WEBGL2 context.
 */
export function initWebGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');

  if (!gl) {
    throw 'Unable to initialize WebGL2. Your browser may not support it.';
  }

  return gl;
}
