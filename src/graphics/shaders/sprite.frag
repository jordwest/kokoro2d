precision mediump float;

varying vec2 texCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;

void main() {
  gl_FragColor = texture2D(texture, texCoord);
}
