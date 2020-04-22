import { mat4 } from 'gl-matrix';
import { CameraSettings, FollowCamera, FreeCamera } from '@/render/camera/camera';

interface OrthoCameraSettings extends CameraSettings {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export class FreeOrthoCamera extends FreeCamera {
  protected left = -150;
  protected right = 150;
  protected bottom = 75;
  protected top = -75;

  constructor(settings?: Partial<OrthoCameraSettings>) {
    super(settings);
    mat4.ortho(this.projection, this.left, this.right, this.bottom, this.top, this.near, this.far);
  }

  setBorders(left: number, right: number, bottom: number, top: number) {
    mat4.ortho(this.projection, left, right, bottom, top, this.near, this.far);
  }
}

export class FollowOrthoCamera extends FollowCamera {
  protected left = -150;
  protected right = 150;
  protected bottom = 75;
  protected top = -75;

  constructor(settings?: Partial<OrthoCameraSettings>) {
    super(settings);
    mat4.ortho(this.projection, this.left, this.right, this.bottom, this.top, this.near, this.far);
  }

  setBorders(left: number, right: number, bottom: number, top: number) {
    mat4.ortho(this.projection, left, right, bottom, top, this.near, this.far);
  }
}
