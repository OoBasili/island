import { initWebGL } from '@/scripts/webgl/helpers';
import { resize } from '@/scripts/common/helpers';
import { SizeOptions, CanvasMessage } from '@/types/webworker';
import { Camera } from '@/render/Camera';

export class RenderModel {
  private static instance: RenderModel;
  private gl?: WebGL2RenderingContext;
  private requestId: number;
  private camera: Camera;

  private constructor() {
    this.camera = new Camera();
    this.requestId = 0;
  };
  
  static getInstance(): RenderModel {
    if (!RenderModel.instance)
      RenderModel.instance = new RenderModel();
    
    return RenderModel.instance;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  getCamera() {
    return this.camera;
  }
  
  setGLContext({canvas, size}: CanvasMessage): WebGL2RenderingContext {
    this.gl = initWebGL(canvas);
    this.reshape(size);
    return this.gl;
  }

  setReqId(reqId: number): void {
    this.requestId = reqId;
  }

  getReqId(): number {
    return this.requestId;
  }

  reshape(size: SizeOptions) {
    if (!this.gl)
      return;
    
    resize(this.gl, size);
    this.camera.setProjection(75, this.gl.canvas.width / this.gl.canvas.height, .1, 200);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
}
