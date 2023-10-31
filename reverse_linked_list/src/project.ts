import { makeProject } from '@motion-canvas/core';

import code from './scenes/code?scene';
import vibe from './scenes/vibe?scene';

export default makeProject({
  scenes: [vibe, code]
});
