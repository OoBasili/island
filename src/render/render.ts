import { mat4 } from 'gl-matrix';

import { createProgram } from '@/scripts/webgl/shaders';

import { CanvasMessage, ResizeMessage, BaseMessage, MessageType, KeyboardMessage, WheelMessage } from '@/types/webworker';

import { DEFAULT_VS, DEFAULT_FS} from '@/shaders/default';
import { RenderModel } from '@/render/RenderModel';
import { InputModel } from '@/render/InputModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const renderModel = RenderModel.getInstance();
const inputModel = InputModel.getInstance();

function main(gl: WebGL2RenderingContext) {
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

  inputModel.setCamera(renderModel.getCamera());
  
  const model = mat4.create();

  mat4.identity(model);
  
  const mvp = mat4.create();

  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
  
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    
    mat4.mul(mvp, model, renderModel.getCamera().getView());
    mat4.mul(mvp, renderModel.getCamera().getProjection(), mvp);
    gl.uniformMatrix4fv(matrixLocation, false, mvp);
  
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    renderModel.setReqId(requestAnimationFrame(render));
  };
  renderModel.setReqId(requestAnimationFrame(render));
}
  
ctx.onmessage = (e: MessageEvent) => {
  const data: BaseMessage = e.data;
  switch (data.type) {
  case MessageType.Main: {
    main(renderModel.setGLContext(data as CanvasMessage));
    break;
  }
  case MessageType.Resize: {
    renderModel.reshape((data as ResizeMessage).size);
    break;
  }
  case MessageType.Unload: {
    const reqId = renderModel.getReqId();
    reqId && cancelAnimationFrame(reqId);
    break;
  }
  case MessageType.KeyboardEvent: {
    inputModel.keyboardHandler(data as KeyboardMessage);
    break;
  }
  case MessageType.MouseEvent: {
    break;
  }
  case MessageType.TouchEvent: {
    break;
  }
  case MessageType.WheelEvent: {
    inputModel.wheelHandler(data as WheelMessage);
    break;
  }
  default:
    throw new Error(`No handler for type: ${data.type}`);
  }
};
