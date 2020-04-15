import { Shader } from '@/types/webgl';

export const DEFAULT_VS: Shader = {
  type: WebGL2RenderingContext.VERTEX_SHADER,
  value:`
    attribute vec4 a_position;

    void main() {
      gl_Position = a_position;
    }
  `
};

export const DEFAULT_FS: Shader = {
  type: WebGL2RenderingContext.FRAGMENT_SHADER,
  value:`
    precision mediump float;
      
    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
  `
};
