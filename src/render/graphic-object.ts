import { createProgram } from '@/scripts/webgl/shaders';
import { DEFAULT_FS, DEFAULT_VS } from '@/shaders/default';
import { mat4 } from 'gl-matrix';

export class GraphicObject {
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;

  private positionLocation: number;
  private matrixLocation: WebGLUniformLocation | null;
  private positionBuffer: WebGLBuffer | null;
  private model = mat4.create();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = createProgram(this.gl, [DEFAULT_VS, DEFAULT_FS]);
    this.positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const positions = [
      1, 0, -1,
      -1, 0, -1,
      -1, 0, 1,
      -1, 0, 1,
      1, 0, 1,
      1, 0, -1
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    
    this.matrixLocation = this.gl.getUniformLocation(this.program, 'mvp');
    mat4.identity(this.model);
  }

  draw(view?: mat4, projection?: mat4): void {
    if (!view || !projection)
      return;
    
    this.gl.useProgram(this.program);
  
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);


    this.gl.uniformMatrix4fv(
      this.matrixLocation, false, mat4.mul(
        mat4.create(), projection, mat4.mul(mat4.create(), view, this.model)
      )
    );
  
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}