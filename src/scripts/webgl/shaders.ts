import { Shader } from '@/types/webgl';

/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {Shader} shader The shader which will be created.
 * @return {WebGLShader} The created shader.
 */
function loadShader(gl: WebGL2RenderingContext, {type, value}: Shader): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader)
    throw `${type == gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader create failure`;

  gl.shaderSource(shader, value);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw `Error compiling shader ${shader}: ${gl.getShaderInfoLog(shader)}`;
  }

  return shader;
}

/**
 * Create a program.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {Shader[]} shaders Array of attached shaders.
 * @return {WebGLProgram} The created program.
 */
export function createProgram(gl: WebGL2RenderingContext, shaders: Shader[]): WebGLProgram {
  const program = gl.createProgram();
  if (!program)
    throw 'GL create program failure';

  shaders.forEach(shader => gl.attachShader(program, loadShader(gl, shader)));
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw `Error in program linking: ${gl.getProgramInfoLog(program)}`;
  }

  return program;
}
