import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {createRef} from '@motion-canvas/core/lib/utils';
import {
  CodeBlock,
  edit,
  insert,
  lines,
  remove,
  range
} from '@motion-canvas/2d/lib/components/CodeBlock';
import {all, waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {

  const codeBlockRef = createRef<CodeBlock>();
  yield view.add(
    <CodeBlock ref={codeBlockRef} code={`...`} selection={range(0, 2, 0, 4)} />,
  );
  // or
});