import { mat4, vec3, glMatrix } from 'gl-matrix';
import { inRange } from '@/scripts/common/helpers';

export interface CameraSettings {
  near: number;
  far: number;
  eye: vec3;
  center: vec3;
  up: vec3;
}

export class Camera {
  protected readonly projection = mat4.create();
  protected near = .1;
  protected far = 200;

  protected readonly view = mat4.create();
  protected readonly center = vec3.fromValues(0, 0, 0);
  protected readonly eye = vec3.fromValues(0, 3, 4);
  protected readonly up = vec3.fromValues(0, 1, 0);

  constructor(settings?: Partial<CameraSettings>) {
    settings && Object.assign(this, settings);
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }

  getProjection() {
    return this.projection;
  }

  getView() {
    return this.view;
  }

  rotateH(angle: number) {
    vec3.rotateY(this.eye, this.eye, this.center, glMatrix.toRadian(angle));
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }

  rotateV(angle: number) {
    const vec = vec3.sub(vec3.create(), this.eye, this.center);
    const radiusZXPow = Math.pow(vec[0], 2) + Math.pow(vec[2], 2);
    const radius = Math.sqrt(Math.pow(vec[1], 2) + radiusZXPow);
    
    const radY = Math.acos(vec[1] / radius) + glMatrix.toRadian(angle);

    if (!inRange(radY, [.1, 1.5]))
      return;

    vec3.add(
      this.eye,
      this.center,
      vec3.fromValues(
        radius * Math.sin(radY) * (vec[0] / Math.sqrt(radiusZXPow)),
        radius * Math.cos(radY),
        radius * Math.sin(radY) * (vec[2] / Math.sqrt(radiusZXPow))
      )
    );
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }

  zoom(rad: number) {
    const vec = vec3.sub(vec3.create(), this.eye, this.center);
    const radius = Math.sqrt(Math.pow(vec[1], 2) + Math.pow(vec[0], 2) + Math.pow(vec[2], 2));


    if (!inRange(radius + rad, [this.near, this.far]))
      return;

    vec3.add(
      this.eye,
      this.eye,
      vec3.mul(
        vec,
        vec3.normalize(vec, vec),
        vec3.fromValues(rad, rad, rad)
      )
    );
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }
}

export class FollowCamera extends Camera {
  setCenter(center: vec3) {
    vec3.add(this.eye, this.eye, vec3.sub(vec3.create(), center, this.center));
    vec3.copy(this.center, center);
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }
}

export class FreeCamera extends Camera {
  moveF(speed: number) {
    const vec = vec3.mul(
      vec3.create(),
      vec3.fromValues(speed / 1000, 0, speed / 1000),
      vec3.normalize(
        vec3.create(),
        vec3.fromValues(
          this.center[0] - this.eye[0],
          0,
          this.center[2] - this.eye[2]
        )
      )
    );
    vec3.add(this.center, this.center, vec);
    vec3.add(this.eye, this.eye, vec);
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }

  moveR(speed: number) {
    const vec = vec3.mul(
      vec3.create(),
      vec3.fromValues(speed / 1000, 0, speed / 1000),
      vec3.normalize(
        vec3.create(),
        vec3.cross(
          vec3.create(),
          vec3.fromValues(
            this.center[0] - this.eye[0],
            0,
            this.center[2] - this.eye[2]
          ),
          vec3.fromValues(0, 1, 0)
        )
      )
    );
    vec3.add(this.center, this.center, vec);
    vec3.add(this.eye, this.eye, vec);
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }

  moveUp(speed: number) {
    const vec = vec3.sub(vec3.create(), this.center, this.eye);

    vec3.add(
      this.center, this.center, vec3.fromValues(
        (speed / 1000) * vec[0] / Math.abs(vec[1]), 0 , (speed / 1000) * vec[2] / Math.abs(vec[1])
      )
    );
    vec3.add(this.eye, this.eye, vec3.fromValues(0, speed / 1000 , 0));
    mat4.lookAt(this.view, this.eye, this.center, this.up);
  }
}
