import { SpriteProgram } from './shaders/sprite';
import * as twgl from 'twgl.js';
import {Quad} from "./quad";
import {RectProgram} from "./shaders/shapes/rect";

export namespace Graphics {
    export enum FilterMode {
        /**
         * Linear filtering.
         * 
         * Smoothly interpolates between pixels, results in a blurry effect when scaling up.
         */
        LINEAR,

        /**
         * Nearest neighbour filtering.
         * 
         * Chooses the nearest pixel, scaling up in a pixelated fashion.
         */
        NEAREST,
    }

    export class Image {
        private readonly ctx: WebGLRenderingContext;
        public readonly width: number;
        public readonly height: number;
        public readonly texture: WebGLTexture;
        public readonly flipped = false;

        constructor(ctx: WebGLRenderingContext, filename: string, width: number, height: number) {
            this.ctx = ctx;
            this.texture = twgl.createTexture(ctx, {
                src: filename,
                width,
                height,
            });

            this.width = width;
            this.height = height;
        }

        setFilter(min: FilterMode, mag: FilterMode) {
            const gl = this.ctx;

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min === FilterMode.LINEAR ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag === FilterMode.LINEAR ? gl.LINEAR : gl.NEAREST);
        }
    }
    
    export class Canvas {
        private readonly ctx: WebGLRenderingContext;
        public readonly width: number;
        public readonly height: number;
        public readonly texture: WebGLTexture;
        public readonly framebuffer: twgl.FramebufferInfo;
        public readonly flipped = true;
        
        constructor(gl: WebGLRenderingContext, width: number, height: number) {
            this.ctx = gl;
            const attachments = [
                { format: gl.RGBA, type: gl.UNSIGNED_BYTE, min: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE },
            ];
            this.framebuffer = twgl.createFramebufferInfo(gl, attachments, width, height);
            this.texture = this.framebuffer.attachments[0];
            this.width = width;
            this.height = height;
        }

        setFilter(min: FilterMode, mag: FilterMode) {
            const gl = this.ctx;

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min === FilterMode.LINEAR ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag === FilterMode.LINEAR ? gl.LINEAR : gl.NEAREST);
        }
    }
    
    export type Color = {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    type ReadyState = {
        ctx: WebGLRenderingContext;
        spriteProgram: SpriteProgram;
        rectProgram: RectProgram;
        activeCanvas: Canvas | undefined;
        activeColor: Color;
    };
    
    let state: ReadyState | undefined;
    
    export function getState(): ReadyState {
        if (state != null) return state;
        throw new Error('[Kokoro2D] Call the `init` function before calling any drawing functions');
    }
    
    export function init(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('webgl' , {premultipliedAlpha: false});
        if (ctx == null) throw new Error('[Kokoro2D] Could not initialize WebGL');

        const spriteProgram = new SpriteProgram(ctx);
        const rectProgram = new RectProgram(ctx);
        state = {
            ctx,
            spriteProgram,
            rectProgram,
            activeCanvas: undefined,
            activeColor: {
                r: 1,
                g: 1,
                b: 1,
                a: 1,
            }
        };
        
        setCanvas();
    }
    
    export function newImage(filename: string, width: number, height: number): Image {
        const { ctx } = getState();
        return new Image(ctx, filename, width, height);
    }
    
    export function newCanvas(width: number, height: number): Canvas {
        const { ctx } = getState();
        return new Canvas(ctx, width, height);
    }
    
    export function newQuad(x: number, y: number, width: number, height: number, image: Image | Canvas): Quad {
        return {
            x: x / image.width,
            y: y / image.height,
            width: width / image.width,
            height: height / image.height,
        };
    }
    
    export function setCanvas(canvas?: Canvas) {
        const state = getState();
        const { ctx } = state;
        
        if (canvas == null) {
            state.activeCanvas = undefined;
            ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
            twgl.bindFramebufferInfo(ctx);
        } else {
            state.activeCanvas = canvas;
            ctx.viewport(0, 0, canvas.width, canvas.height);
            twgl.bindFramebufferInfo(ctx, canvas && canvas.framebuffer);
        }
    }
    
    export function clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        const { ctx }  = getState();
        
        ctx.clearColor(r, g, b, a);
        ctx.clear(ctx.COLOR_BUFFER_BIT);
    }
    
    export function draw(image: Image | Canvas, quad: Quad, x: number, y: number, width: number, height: number) {
        const { ctx, spriteProgram, activeCanvas } = getState();
        
        let resolution: [number, number];
        if (activeCanvas != null) {
            resolution = [activeCanvas.width, activeCanvas.height];
        } else {
            resolution = [ctx.canvas.width, ctx.canvas.height];
        }
        const flip = image.flipped;
        spriteProgram.render(x, y, width, height, image.texture, quad, 0, resolution, flip);
    }
    
    export function setColor(color: Color) {
        getState().activeColor = color;
    }
    
    export function rectangle(x: number, y: number, width: number, height: number) {
        const { ctx, rectProgram, activeCanvas, activeColor } = getState();

        let resolution: [number, number];
        if (activeCanvas != null) {
            resolution = [activeCanvas.width, activeCanvas.height];
        } else {
            resolution = [ctx.canvas.width, ctx.canvas.height];
        }

        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        rectProgram.render(x, y, width, height, [activeColor.r, activeColor.g, activeColor.b, activeColor.a], resolution);
    }
}