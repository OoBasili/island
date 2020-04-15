<template>
  <canvas ref='canvas'/>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

import { initWebGL } from '@/scripts/webgl/helpers';
import { createProgram } from '@/scripts/webgl/shaders';
import { DEFAULT_VS, DEFAULT_FS} from '@/shaders/default';
import { resizeCanvas } from '@/scripts/common/helpers';

@Component
export default class Canvas extends Vue {
  private mounted(): void {
    try {
      const gl = initWebGL(this.$refs.canvas as HTMLCanvasElement);
      const program = createProgram(gl, [DEFAULT_VS, DEFAULT_FS]);

      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [
        -0.5, 0,
        0, 0.5,
        0.7, 0.3,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const render = (): void => {
        resizeCanvas(gl.canvas as HTMLCanvasElement);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

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
