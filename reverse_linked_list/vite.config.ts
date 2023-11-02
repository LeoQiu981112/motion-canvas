import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  assetsInclude: ['**/*.py'],
  plugins: [
    motionCanvas(),
    ffmpeg(),
  ],
});
