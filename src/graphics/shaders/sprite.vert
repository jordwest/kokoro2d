precision mediump float;

attribute vec4 position;

uniform vec2 offset;
uniform vec2 size;
uniform vec2 texOffset;
uniform vec2 texSize;
uniform vec2 resolution;
uniform float time;
uniform bool flipY;

varying vec2 texCoord;

void main() {
  vec2 scaleFactor = vec2(
    (size.x / resolution.x) * 2.0,
    (size.y / resolution.y) * -2.0
  );
  vec2 offsetFactor = vec2(
    ((offset.x / resolution.x) * 2.0) - 1.0,
    ((offset.y / resolution.y) * -2.0) + 1.0
  );
  gl_Position = vec4(
    (position.xy * scaleFactor) + offsetFactor,
    0,
    1
  );
  
  vec2 flipped = vec2(position.x, flipY ? 1.0 - position.y : position.y);
  texCoord = flipped * texSize + texOffset;
}
