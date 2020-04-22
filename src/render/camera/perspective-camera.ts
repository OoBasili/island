import { mat4, glMatrix } from 'gl-matrix';
import { CameraSettings, FollowCamera, FreeCamera } from '@/render/camera/camera';

interface PerspectiveCameraSettings extends CameraSettings {
  fov: number;
  aspect: number;
}

export class FreePerspectiveCamera extends FreeCamera {
  protected fov = glMatrix.toRadian(75);
  protected aspect = 2;

  constructor(settings?: Partial<PerspectiveCameraSettings>) {
    super(settings);
    mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
  }

  setAspect(aspect: number) {
    mat4.perspective(this.projection, this.fov, aspect, this.near, this.far);
  }
}

export class FollowPerspectiveCamera extends FollowCamera {
  protected fov = glMatrix.toRadian(75);
  protected aspect = 2;

  constructor(settings?: Partial<PerspectiveCameraSettings>) {
    super(settings);
    mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
  }

  setAspect(aspect: number) {
    mat4.perspective(this.projection, this.fov, aspect, this.near, this.far);
  }
}
