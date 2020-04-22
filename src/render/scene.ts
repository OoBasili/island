import { GraphicObject } from '@/render/graphic-object';
import { RenderModel } from '@/render/render-model';
import { InputModel, MouseButton } from '@/render/input-model';
import { CanvasMessage } from '@/types/webworker';
import { Camera, FreeCamera } from '@/render/camera/camera';
import { FollowPerspectiveCamera, FreePerspectiveCamera } from '@/render/camera/perspective-camera';
import { FreeOrthoCamera, FollowOrthoCamera } from '@/render/camera/ortho-camera';

export const enum CameraType {
  FreePerspective,
  FollowPerspective,
  FreeOrtho,
  FollowOrtho
}

export class Scene {
  private objects: Map<number, GraphicObject> = new Map();
  private cameras: Map<CameraType, Camera> = new Map();
  private activeCam: CameraType;

  constructor(data: CanvasMessage) {
    this.activeCam = CameraType.FreePerspective;

    const camera = new FreePerspectiveCamera();
    this.cameras.set(CameraType.FreePerspective, camera);
    this.cameras.set(CameraType.FollowPerspective, new FollowPerspectiveCamera());
    this.cameras.set(CameraType.FreeOrtho, new FreeOrthoCamera());
    this.cameras.set(CameraType.FollowOrtho, new FollowOrthoCamera());
  
    InputModel.getInstance().setScene(this);
    RenderModel.getInstance().setCamera(camera);

    const gl = RenderModel.getInstance().setGL(data);
    for (let i = 0; i < 1; i++) {
      this.objects.set(i, new GraphicObject(gl));
    }
  }

  private keyboard(delta: number): void {
    const camera = this.cameras.get(this.activeCam);
    if (InputModel.getInstance().getKeysState(['KeyW', 'ArrowUp']))
      camera instanceof FreeCamera
        ? camera.moveF(delta)
        : console.log('move object');
    if (InputModel.getInstance().getKeysState(['KeyS', 'ArrowDown']))
      camera instanceof FreeCamera
        ? camera.moveF(-delta)
        : console.log('move object');
    if (InputModel.getInstance().getKeysState(['KeyD', 'ArrowRight']))
      camera instanceof FreeCamera
        ? camera.moveR(delta)
        : console.log('move object');
    if (InputModel.getInstance().getKeysState(['KeyA', 'ArrowLeft']))
      camera instanceof FreeCamera
        ? camera.moveR(-delta)
        : console.log('move object');
    if (InputModel.getInstance().getKeysState(['Space']))
      camera instanceof FreeCamera
        ? camera.moveUp(delta)
        : console.log('move object');
  }
  
  private mouse(): void {
    const state = InputModel.getInstance().getMouseState(MouseButton.Left);

    const camera = this.cameras.get(this.activeCam);
    if (state && state[1].x !== undefined && state[1].y !== undefined) {
      camera?.rotateH(state[1].x - state[0].x);
      camera?.rotateV(state[1].y - state[0].y);
      state[1].x = undefined;
      state[1].y = undefined;
    }
  }

  getCamera(): Camera | undefined {
    return this.cameras.get(this.activeCam);
  }

  switchCamera(type?: CameraType): void {
    this.activeCam = type ?? (this.activeCam + 1) % this.cameras.size;
    const camera = this.cameras.get(this.activeCam);
    if (!camera)
      return;
    
    RenderModel.getInstance().setCamera(camera);
  }

  draw() {
    RenderModel.getInstance().start();
    const camera = this.cameras.get(this.activeCam);
    this.objects.forEach(object => object.draw(camera?.getView(), camera?.getProjection()));
  }
 
  simulate(delta: number): void {
    this.keyboard(delta);
    this.mouse();
  }
}