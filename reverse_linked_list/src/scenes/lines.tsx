import { createRef} from "@motion-canvas/core/lib/utils";
import {Ray} from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d";


export default makeScene2D(function* (view) {

// create code pointer
    const ray = createRef<Ray>();
    view.add(
      <Ray
        ref={ray}
        lineWidth={5}
        stroke={'white'}
        // x={codeBlockX-codeBlockWidth/2-70}
        // y={codeBlockY-codeBlockHeight/2+300}
        x={0}
        y={0}
        toY={-150}
      />
    );
    // animate
    yield* ray().start(1, 1);
    // yield* ray().start(0).end(0).start(1, 1);
    ray().remove()
});