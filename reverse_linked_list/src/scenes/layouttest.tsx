import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle, Rect, Layout} from '@motion-canvas/2d/lib/components';
import {createRef,makeRefs} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';
import {waitFor} from '@motion-canvas/core/lib/flow';
const RED = '#ff6470';

export default makeScene2D(function* (view) {
  const colA = createRef<Layout>();
  const colB = createRef<Layout>();
  const rowA = createRef<Layout>();
  const l2 = createRef<Layout>();
  
  view.add(
    <>
      <Layout layout gap={10} padding={10} width={440} height={340}>
        <Rect ref={colA} grow={1} fill={'green'} radius={100} />
        <Layout ref={l2} gap={10} direction="column" grow={3}>
          <Rect
            ref={rowA}
            grow={3}
            fill={RED}
            radius={4}
            stroke={'#fff'}
            lineWidth={4}
            margin={2}
          >
            <Circle layout={false} width={20} height={20} fill={'#fff'} />
          </Rect>
          <Rect grow={2} fill={'yellow'} radius={4} />
          <Rect grow={2} fill={'purple'} radius={4} />
          <Rect grow={2} fill={'brown'} radius={4} />

        </Layout>
        <Rect ref={colB} grow={3} fill={'blue'} radius={4} />
      </Layout>
    </>,
  );

//   yield* all(colB().grow(1, 0.8), colA().grow(2, 0.8));
//   yield* rowA().grow(1, 0.8);
//   yield* all(colB().grow(3, 0.8), colA().grow(1, 0.8));
//   yield* rowA().grow(8, 0.8);
//   yield* l2().grow(0, 0.2);   
//   l2().remove();
//   yield* waitFor(2);
}); 