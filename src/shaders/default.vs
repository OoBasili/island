#version 300 es

layout(location = 0) in vec4 position;
uniform mat4 mvp;
out vec4 coords;

void main() {
  coords = mvp * position;
  gl_Position = coords;
}
