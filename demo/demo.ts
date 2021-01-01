import testSprite from './test-sprite.png';
import {Graphics} from 'kokoro2d';

Graphics.init(document.querySelector('canvas')! as HTMLCanvasElement);
const spritesheet = Graphics.newImage(testSprite, 128, 128);
spritesheet.setFilter(Graphics.FilterMode.LINEAR, Graphics.FilterMode.NEAREST);
const quad = Graphics.newQuad(32, 32, 64, 64, spritesheet);
console.log('quad', quad);

const miniScreen = Graphics.newCanvas(500, 400);
miniScreen.setFilter(Graphics.FilterMode.NEAREST, Graphics.FilterMode.NEAREST);
const all = Graphics.newQuad(0, 0, miniScreen.width, miniScreen.height, miniScreen);

const render = (t: number) => {
    Graphics.setCanvas(miniScreen);
    Graphics.clear();

    Graphics.draw(spritesheet, quad, 70, 0, 128, 128);
    
    for (let i = 0; i < 1000; i++) {
        Graphics.draw(spritesheet, quad, Math.sin(i + t / 1000) * (100 + i) + 300, Math.cos(i + (t / 1000)) * (100 + i) + 300, 24, 24);
    }
    
    Graphics.setCanvas();
    Graphics.clear();
    Graphics.draw(miniScreen, all, 0, 0, 1000, 800);
    
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
