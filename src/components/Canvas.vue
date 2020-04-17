<template>
  <canvas ref='canvas'/>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { mat4, vec3 } from 'gl-matrix';

import { initWebGL } from '@/scripts/webgl/helpers';
import { createProgram } from '@/scripts/webgl/shaders';
import { resizeCanvas, degToRad } from '@/scripts/common/helpers';

import { DEFAULT_VS, DEFAULT_FS} from '@/shaders/default';

@Component
export default class Canvas extends Vue {
  private mounted(): void {
    try {
      const gl = initWebGL(this.$refs.canvas as HTMLCanvasElement);
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
      mat4.perspective(projection, degToRad(45), gl.canvas.width / gl.canvas.height, .1, 100.0);

      const view = mat4.create();
      mat4.lookAt(view, posC, posF, up);

      const model = mat4.create();
      mat4.identity(model);

      const mvp = mat4.create();

      let then = 0;
      
      const render = (time: number): void => {
        const delta = time - then;
        resizeCanvas(gl.canvas as HTMLCanvasElement);
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
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    } catch (e) {
      console.error(e);
    }
  }
}
</script>

<style lang='sass'>
  canvas
    height: 100%
    width: 100%
    display: block
</style>
