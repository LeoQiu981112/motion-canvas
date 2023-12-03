import { makeProject } from '@motion-canvas/core';

import intro from './scenes/intro?scene';

import code from './scenes/code?scene';
import codeline from './scenes/codeline?scene';
import usearray from './scenes/usearray?scene';
import layouttest from './scenes/layouttest?scene';
export default makeProject({
  scenes: [intro,code]
});
