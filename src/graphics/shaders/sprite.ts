import fragmentShader from './sprite.frag';
import vertexShader from './sprite.vert';
import * as twgl from 'twgl.js';
import {Quad} from "../quad";

export class SpriteProgram {
    private gl: WebGLRenderingContext;
    private bufferInfo: twgl.BufferInfo;
    private programInfo: twgl.ProgramInfo;
    
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
    
    render(x: number, y: number, width: number, height: number, texture: WebGLTexture, texQuad: Quad, time: number, resolution: [number, number]) {
        const { gl, programInfo, bufferInfo } = this;
        
        gl.viewport(0, 0, resolution[0], resolution[1]);

        const uniforms = {
            time: time * 0.001,
            resolution,
            offset: [x, y],
            size: [width, height],
            texOffset: [texQuad.x, texQuad.y],
            texSize: [texQuad.width, texQuad.height],
            texture,
        };

        gl.useProgram(programInfo.program);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);
    }
}