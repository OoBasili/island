import { SizeOptions, CanvasMessage } from '@/types/webworker';

import { initWebGL } from '@/scripts/webgl/helpers';
import { resize } from '@/scripts/common/helpers';


import { Camera } from '@/render/camera/camera';
import { FollowPerspectiveCamera, FreePerspectiveCamera } from '@/render/camera/perspective-camera';
import { FreeOrthoCamera, FollowOrthoCamera } from '@/render/camera/ortho-camera';

export class RenderModel {
  private static instance: RenderModel;

  private gl?: WebGL2RenderingContext;
  private requestId?: number;
  private camera?: Camera;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {};
  
  static getInstance(): RenderModel {
    if (!RenderModel.instance)
      RenderModel.instance = new RenderModel();
    
    return RenderModel.instance;
  }

  private cameraResize() {
    const { gl, camera } = RenderModel.instance;
    if (!gl)
      return;

    if (camera instanceof FreePerspectiveCamera || camera instanceof FollowPerspectiveCamera)
      camera.setAspect(gl.canvas.width / gl.canvas.height);
    else if (camera instanceof FreeOrthoCamera || camera instanceof FollowOrthoCamera)
      camera.setBorders(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2);
  }

  setCamera(camera: Camera) {
    RenderModel.instance.camera = camera;
    this.cameraResize();
  }
  
  setGL({canvas, size}: CanvasMessage): WebGL2RenderingContext {
    RenderModel.instance.gl = initWebGL(canvas);
    RenderModel.instance.reshape(size);
    return RenderModel.instance.gl;
  }

  setReqId(reqId: number): void {
    RenderModel.instance.requestId = reqId;
  }

  getReqId(): number | undefined {
    return RenderModel.instance.requestId;
  }

  start() {
    const { gl } = RenderModel.instance;
    if (!gl)
      return;

    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

  }

  reshape(size: SizeOptions) {
    const { gl } = RenderModel.instance;
    if (!gl)
      return;
    
    resize(gl, size);
    this.cameraResize();
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}
