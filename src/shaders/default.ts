import { Shader } from '@/types/webgl';

export const DEFAULT_VS: Shader = {
  type: WebGL2RenderingContext.VERTEX_SHADER,
  value:`#version 300 es

    layout(location = 0) in vec4 position;
    uniform mat4 mvp;
    out vec4 coords;

    void main() {
      coords = mvp * position;
      gl_Position = coords;
    }
  `
};

export const DEFAULT_FS: Shader = {
  type: WebGL2RenderingContext.FRAGMENT_SHADER,
  value:`#version 300 es
    precision highp float;

    in vec4 coords;
    out vec4 fragColor;

    void main() {
      fragColor = vec4(coords.xy, 0. ,1.);
    }
  `
};
