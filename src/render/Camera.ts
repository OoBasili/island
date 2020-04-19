import { mat4, vec3, glMatrix } from 'gl-matrix';

export class Camera {
  private projection = mat4.create();
  private view = mat4.create();
  private eye = vec3.create();
  private center = vec3.create();
  private up = vec3.create();
  private radiusMin: number;
  private radiusMax: number;
  private radius: number;
  private speed: number;
  private radianX: number;
  private radianY: number;
  private oxzMin: number;
  private oxzMax: number;

  constructor() {
    this.radiusMin = 1;
    this.radiusMax = 100;
    this.oxzMin = glMatrix.toRadian(5);
    this.oxzMax = glMatrix.toRadian(85);
    this.radius = 10;
    this.speed = 1.5;
    this.radianX = glMatrix.toRadian(60);
    this.radianY = glMatrix.toRadian(30);

    vec3.set(this.center, 0, 0, 0);
    vec3.set(this.up, 0, 1, 0);
    this.calculateVectors();
  }

  private calculateVectors() {
    const distance = this.radius * Math.cos(this.radianY);
    this.eye[0] = distance * Math.cos(this.radianX);
    this.eye[1] = this.radius * Math.sin(this.radianY);
    this.eye[2] = distance * Math.sin(this.radianX);

    mat4.lookAt(this.view, vec3.add(vec3.create(), this.eye, this.center), this.center, this.up);
  }

  setProjection(fov: number, aspect: number, near: number, far: number) {
    mat4.perspective(this.projection, glMatrix.toRadian(fov), aspect, near, far);
  }

  getProjection() {
    return this.projection;
  }

  getView() {
    return this.view;
  }

  getEye() {
    return this.eye;
  }

  getCenter() {
    return this.center;
  }

  moveOXZ(forward: number, right: number) {
    const vecForward = vec3.normalize(vec3.create(), this.eye);
    const speed = Math.sqrt(Math.sqrt(this.speed));
    const deltaForward = vec3.fromValues(
      vecForward[0] * forward * speed,
      0,
      vecForward[2] * forward * speed
    );
    const deltaRight = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), vecForward, this.up));
    deltaRight[0] = deltaRight[0] * right * speed;
    deltaRight[1] = 0;
    deltaRight[2] = deltaRight[2] * right * speed;
    vec3.add(this.center, this.center, vec3.add(vec3.create(), deltaForward, deltaRight));

    this.calculateVectors();
  }

  rotate(horizontal: number, vertical: number) {
    this.radianX += glMatrix.toRadian(horizontal * this.speed);
    if ((this.radianY >= this.oxzMin) && (this.radianY <= this.oxzMax)) {
      this.radianY += glMatrix.toRadian(vertical * this.speed);
      this.radianY = Math.max(this.oxzMin, Math.min(this.oxzMax, this.radianY));
    }
    this.calculateVectors();
  }

  zoom(radius: number) {
    if ((this.radius >= this.radiusMin) && (this.radius <= this.radiusMax)) {
      this.radius -= radius * this.speed;
      this.radius = Math.max(this.radiusMin, Math.min(this.radius, this.radiusMax));
    }
    this.calculateVectors();
  }

  setRadius(current: number, min: number, max: number) {
    this.radius = current;
    this.radiusMin = min;
    this.radiusMax = max;
  }

  setVertical(current: number, min: number, max: number) {
    this.radianY = glMatrix.toRadian(current);
    this.oxzMin = glMatrix.toRadian(min);
    this.oxzMax = glMatrix.toRadian(max);

    this.calculateVectors();
  }

  setHorizontal(current: number) {
    this.radianX = glMatrix.toRadian(current);

    this.calculateVectors();
  }
}
