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

Graphics.setCanvas(miniScreen);
Graphics.clear(0, 0, 0, 1);

let t = 0;
const render = () => {
    t += 16;
    Graphics.setCanvas(miniScreen);
    Graphics.setColor({ r: 0, g: 0, b: 0, a: 0.02 });
    Graphics.rectangle(0, 0, 1000, 800);

    Graphics.draw(spritesheet, quad, 70, 1, 64, 64);
    
    Graphics.draw(spritesheet, quad, Math.sin(t / 500) * 300 + 500, Math.cos(t/400) * 300 + 400, 64, 64);

    const quad1 = Graphics.newQuad((Math.floor(t / 1000) % 4) * 32, 0, 32, 32, spritesheet);
    for (let i = 0; i < 1000; i++) {
        Graphics.draw(spritesheet, quad1, Math.sin(i + t / 1000) * (50 + i) + 150, Math.cos(i + (t / 1000)) * (50 + i) + 150, 32, 32);
    }
    
    Graphics.setCanvas();
    Graphics.clear(0, 0, 0, 1);
    Graphics.draw(miniScreen, all, 0, 0, 1000, 800);
    
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
