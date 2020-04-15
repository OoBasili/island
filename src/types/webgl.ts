/**
 * The shader.
 * @param {number} type VERTEX_SHADER or FRAGMENT_FROM from WebGL2RenderingContext.
 * @param {string} value Shader GLSL code.
 */
export interface Shader {
  type: number;
  value: string;
}