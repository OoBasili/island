import { mat4, vec3 } from 'gl-matrix';

import { initWebGL } from '@/scripts/webgl/helpers';
import { createProgram } from '@/scripts/webgl/shaders';
import { resize, degToRad } from '@/scripts/common/helpers';

import { SizeOptions, CanvasMessage, ResizeMessage, BaseMessage, MessageType } from '@/types/webworker';

import { DEFAULT_VS, DEFAULT_FS} from '@/shaders/default';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const size: SizeOptions = {
  width: 300,
  height: 150,
  pixelRatio: 1
};

let requestId: number;

function main({canvas}: CanvasMessage) {
  try {
    const gl = initWebGL(canvas);
    resize(gl, size);

    const program = createProgram(gl, [DEFAULT_VS, DEFAULT_FS]);
    const positionLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1., -1., 0.,
      1., -1., 0.,
      0., 1., 0.
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const matrixLocation = gl.getUniformLocation(program, 'mvp');
    const posF = vec3.create();
    vec3.set(posF, 0, 0, 0);
    const posC = vec3.create();
    vec3.set(posC, 4, 3, 3);
    const up = vec3.create();
    vec3.set(up, 0, 1, 0);
    
    const projection = mat4.create();
    const view = mat4.create();
    const model = mat4.create();

    mat4.perspective(projection, degToRad(45), gl.canvas.width / gl.canvas.height, .1, 100.0);
    mat4.lookAt(view, posC, posF, up);
    mat4.identity(model);
    
    const mvp = mat4.create();
    let then = 0;
        
    const render = (time: number): void => {
      const delta = time - then;
      resize(gl, size);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
    
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      
      mat4.rotateY(view, view, degToRad(delta / 100));
      mat4.mul(mvp, model, view);
      mat4.mul(mvp, projection, mvp);
      gl.uniformMatrix4fv(matrixLocation, false, mvp);
    
      gl.drawArrays(gl.TRIANGLES, 0, 3);
        
      then = time;
      requestId = requestAnimationFrame(render);
    };
    requestId = requestAnimationFrame(render);
  } catch (e) {
    console.error(e);
  }
}
  
ctx.onmessage = (e: MessageEvent) => {
  const data: BaseMessage = e.data;
  switch (data.type) {
  case MessageType.Main: {
    main(data as CanvasMessage);
    break;
  }
  case MessageType.Resize: {
    Object.assign(size, (data as ResizeMessage).size);
    break;
  }
  case MessageType.Unload: {
    requestId && cancelAnimationFrame(requestId);
    break;
  }
  default:
    throw new Error(`No handler for type: ${data.type}`);
  }
};
