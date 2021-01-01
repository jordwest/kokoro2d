import fragmentShader from './rect.frag';
import vertexShader from './quad.vert';
import * as twgl from 'twgl.js';

export class RectProgram {
    private gl: WebGLRenderingContext;
    private readonly bufferInfo: twgl.BufferInfo;
    private readonly programInfo: twgl.ProgramInfo;

    constructor(ctx: WebGLRenderingContext) {
        this.gl = ctx;
        this.programInfo = twgl.createProgramInfo(ctx,
            [vertexShader, fragmentShader]);

        const arrays = {
            position: {
                data: [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                numComponents: 2,
            },
        };
        this.bufferInfo = twgl.createBufferInfoFromArrays(ctx, arrays);
        twgl.setBuffersAndAttributes(ctx, this.programInfo, this.bufferInfo);
    }

    render(x: number, y: number, width: number, height: number, color: [number, number, number, number], resolution: [number, number]) {
        const {gl, programInfo, bufferInfo} = this;

        gl.viewport(0, 0, resolution[0], resolution[1]);

        const uniforms = {
            resolution,
            offset: [x, y],
            size: [width, height],
            color,
        };

        gl.useProgram(programInfo.program);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);
    }
}