#version 300 es
precision highp float;

in vec4 coords;
out vec4 fragColor;

void main() {
  fragColor = vec4(coords.xy, 0. ,1.);
}
