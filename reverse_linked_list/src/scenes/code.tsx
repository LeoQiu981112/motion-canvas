import { Layout, makeScene2D, CubicBezier, Path } from "@motion-canvas/2d";
import { Line, Rect, Node, Ray, Circle, Txt, Img } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert, remove, lines, range as crange } from "@motion-canvas/2d/lib/components/CodeBlock";
import { all, waitFor, waitUntil, delay, makeRef, range, chain, BBox, sequence } from '@motion-canvas/core';
import { createSignal } from "@motion-canvas/core/lib/signals";
import { slideTransition, zoomInTransition, zoomOutTransition, fadeTransition } from "@motion-canvas/core/lib/transitions";
import { Direction } from "@motion-canvas/core/lib/types";
import { createRef, useLogger, useScene } from "@motion-canvas/core/lib/utils";
import { Array, Quote, xAlign, yAlign } from "../components/array";
import { Colors } from '../styles'
import { Tab } from '../../../packages/ui/src/components/tabs/Tabs';
import * as Code from '../code_files/code_to_add';
import { borderHighlight } from '../../../packages/ui/src/components/animations/borderHighlight';
import { Color } from 'chroma-js';
import { PlopSpring, SmoothSpring, spring, } from '../../../packages/core/src/tweening';
import { formatDuration } from '../../../packages/ui/src/utils/formatDuration';
import question_mark from '../images/question_mark.png';
import q1 from '../images/problem1.png';
import q2 from '../images/problem2.png';
import { codeBlocks } from '../code_files/code_to_add';
import { fillRect } from '../../../packages/2d/src/utils/CanvasUtils';

// center/focus view coodinates on screen helper function
// and then unfocus, uncenter, can perhaps use the restore to previous state
// can maybe do something similar for view transitions

// create helpers for creating rows/columns of text nodes
// eventually maybe for specific ds and algos

export default makeScene2D(function* (view) {
  // const scale = 75;
  const core_scale = createSignal(1);
  const code = createRef<CodeBlock>();
  const code_layout = createRef<Layout>();
  const preview = createRef<Node>();

  const stringLiteral = createSignal(["H", "e", "l", "l", "o"])
  const strArray = createRef<Array>();
  const stringArray = createRef<Array>();


  const previewOpacity = createSignal(0);

  const strOpacity = createSignal(0);
  const stringOpacity = createSignal(0);
  const lineOpacity = createSignal(0);
  const codeOpacity = createSignal(0);
  const index = createSignal(1);
  const path = createRef<Path>();
  const rects: Rect[] = [];
  const circs: Circle[] = [];
  const Texts: Txt[] = [];

  const RED = '#ff6470';

  const codeBlockX = 200
  const codeBlockY = 45
  const codeBlockWidth = 1500
  const codeBlockHeight = 900
  const layoutX = -600
  const layoutY = -100


  const layout_scale = createSignal(1);

  const core_layout_ref = createRef<Layout>();
  const core_layout =
    <Layout
      ref={core_layout_ref}
      scale={() => core_scale()}
    >
    </Layout>

  view.add(core_layout)

  core_layout.add(
    <Node x={400} ref={preview} opacity={() => previewOpacity()}>
      <Line
        points={() => {
          if (index() == -1) return [[0, 0], [0, 0]];
          let x = stringArray().getIndexBox(0).position().x;
          let i = Math.round(index());
          useLogger().info(i + " " + index().toFixed(2))
          let newPos = strArray().getIndexBox(i + 1);

          return [
            [x, stringArray().getIndexBox(i).position().y + 60],
            [newPos.position().x, strArray().position().y - 60],
          ]
        }}
        opacity={() => lineOpacity()}
        lineWidth={8}
        arrowSize={20}
        stroke={Colors.surfaceLight}
      />
      <Array
        ref={stringArray}
        opacity={() => stringOpacity()}
        name="hello"
        suffix="String"
        suffixColor={Colors.red}
        values={() => {
          return { ptr: `*${index() == -1 ? "?" : Math.round(index())}`, len: `${stringLiteral.length}`, cap: '5' }
        }}
        highlightIndexes={[0]}
        quoteChars={Quote.none}
        invertColors={true}
      />

      <Array
        ref={strArray}
        name="hello"
        suffix="&str"
        suffixColor={Colors.FUNCTION}
        opacity={() => strOpacity()}
        y={() => 200 * stringOpacity()}
        x={80}
        values={() => stringLiteral()}
        nameAlignment={{ x: xAlign.left, y: yAlign.bottom }}
        invertColors={true}
        highlightIndexes={[1]}
      />
    </Node>
  );

  const problem1 = createRef<Img>();
  const problem2 = createRef<Img>();
  const layoutref = createRef<Layout>();

  // create coordinate vector

  const center_pos = { x: 0, y: 0 }

  // from center, create remaining from given x y dispolacements and put into array
  const displace_x = 900
  const displace_y = 700
  const top_left_pos = { x: center_pos.x - displace_x, y: center_pos.y - displace_y }
  const top_right_pos = { x: center_pos.x + displace_x, y: center_pos.y - displace_y }
  const bottom_left_pos = { x: center_pos.x - displace_x, y: center_pos.y + displace_y }
  const bottom_right_pos = { x: center_pos.x + displace_x, y: center_pos.y + displace_y }
  const top_pos = { x: center_pos.x, y: center_pos.y - displace_y }
  const bottom_pos = { x: center_pos.x, y: center_pos.y + displace_y }
  const left_pos = { x: center_pos.x - displace_x, y: center_pos.y }
  const right_pos = { x: center_pos.x + displace_x, y: center_pos.y }

  // create transition time map from very slow to very fast with keys being the name of the transition
  const speed_m = {
    'very slow': 1.5,
    'slow': 1,
    'medium': 0.5,
    'fast': 0.35,
    'very fast': 0.20
  }




  // put the above into an array
  const positions = [bottom_left_pos, top_left_pos, bottom_right_pos, top_right_pos, center_pos, top_pos, bottom_pos, left_pos, right_pos]
  // create square at each position
  const squares = []
  for (const pos of positions) {
    squares.push(
      <Rect
        width={50}
        height={50}
        x={pos.x}
        y={pos.y}
        fill="silver"
        opacity={0.5}
        radius={10}
      />
    )
  }
  core_layout.add(squares)



  core_layout.add(
    <Layout layout ref={layoutref} gap={10} padding={10} direction={"column"} position={[-800, 400]} scale={layout_scale()}>
      <Img ref={problem1} src={q1} opacity={0.8} />
      <Img ref={problem2} src={q2} opacity={0.8} />
    </Layout>
  );

  yield* fadeTransition(speed_m["very fast"])

  yield* waitFor(speed_m["very fast"])
  const headRef = createRef<Txt>();

  const head =
    <Txt
      ref={headRef}
      fontFamily={'JetBrains Mono'}
      fontSize={48}
      fill={'white'}
      opacity={0}
      position={{ x: -1550, y: -450 }}
    >Head</Txt>



  // circ stuff------------------------------------------------------------------------------
  // Create some circ
  const text_opac = createSignal(0);

  const layout = <Layout opacity={0}></Layout>
  // add the circle into the layout

  const circles =
    range(5).map(i => (
      <Circle
        ref={makeRef(circs, i)}
        width={100}
        height={100}
        x={headRef().position().x - 200}
        y={headRef().position().y + 200}
        stroke={'78909C'}
        fill={"#607D8B"}
        lineWidth={8}
        startAngle={0}
        endAngle={0}
      >
        <Txt
          ref={makeRef(Texts, i)}
          opacity={() => text_opac()}
          fontFamily={'JetBrains Mono'}
          fill="FFFFFF"
        >{i + 1}</Txt>
      </Circle>
    ))

  layout.add(circles)
  layout.add(head)

  core_layout.add(layout)


  // move circles------------------------------------------------------------------------------------
  // 
  yield* waitUntil('move circles')
  const circle_gap = 200

  const moveCirc = [];
  let counter = 0
  const spread = []
  for (const circ of circs) {
    spread.push(circ.x(right_pos.x + circle_gap * counter, speed_m["very fast"] * counter))
    spread.push(circ.endAngle(360, 1.5))
    counter += 1
    spread.push(text_opac(counter / 5, speed_m["very fast"] * counter))

  }

  for (const circ of circs) {
    // No yield here, just store the generators.
    moveCirc.push(circ.position.y(50, 0.5).to(-50, 0.5).to(0, 0.5));
  }
  yield* all(
    head.x(right_pos.x, 1),
    head.opacity(1, 1.5),
    layout.opacity(1, 0.5),
    ...spread)


  // yield* all(...moveCirc);

  yield* waitUntil('move question down')
  yield* layoutref().y(-1200, 1)


  // techniques------------------------------------------------------------------------------------
  yield* waitUntil('remove q, show techniques')
  // create text "Linked List"
  const linkedListRef = createRef<CodeBlock>();
  let text = "Linked List";
  // put each line into a codeblock
  let technqiue_strs = ["Dummy head", "Two pointer", "Iterative traversal", "Recursive Traversal", "In place reversal"]
  const linkedList = <CodeBlock
    ref={linkedListRef} fontFamily={'JetBrains Mono'} fontSize={140}
    fill={'white'} position={[top_left_pos.x, top_left_pos.y - 1000]} >{text}
  </CodeBlock>
  core_layout.add(linkedList)


  // keep only dummy head in text and
  const technqiue_refs: CodeBlock[] = []
  const techniques =
    technqiue_strs.map((technique, i) => (
      <CodeBlock
        ref={makeRef(technqiue_refs, i)}
        fontSize={96}
        fontFamily={'JetBrains Mono'}
        position={[left_pos.x - 1000, top_left_pos.y + 300 * i + 250]}
        stroke={'78909C'}
        fill={"#607D8B"}
      >{technique}
      </CodeBlock>
    ))
  layout.add(techniques)
  core_layout.add(techniques)

  // move each technique down using a counter and fade in
  const moveTechniques = [];
  let counter2 = 0
  for (const technique of technqiue_refs) {
    moveTechniques.push(technique.position.x(left_pos.x, counter2 * speed_m["fast"] + 0.4))
    moveTechniques.push(technique.opacity(1, counter2 * speed_m["fast"]))
    counter2 += 1
  }

  // move linkedlist down
  // move problem1 and 2 out at the same time
  yield* all(
    layoutref().x(-2000, speed_m["slow"]),
    linkedListRef().position(top_left_pos, speed_m["fast"]), ...moveTechniques
  );


  yield* problem1().remove()
  yield* problem2().remove()
  // yield* core_layout_ref().x(-1200, 1)


  yield* all(

  )
  // move dummy list to slight above middle pos and increase size to 200

  // dummy head------------------------------------------------------------------------------------

  yield* waitUntil('prep scene for d n')
  yield* all(
    // other than dummy head, fade out the rest
    // also fade out linkedlist
    linkedListRef().opacity(0, 0.5),
    technqiue_refs[0].position([top_pos.x, top_pos.y + 100], 0.5),
    technqiue_refs[0].fontSize(160, 0.5),
    ...technqiue_refs.slice(1).map(technique => technique.opacity(0, 0.5)),

    linkedListRef().opacity(0, 0.5),
    technqiue_refs[0].position([top_pos.x, top_pos.y + 100], 0.5),
    technqiue_refs[0].fontSize(160, 0.5),
    ...technqiue_refs.slice(1).map(technique => technique.opacity(0, 0.5)),
    // move head and the circles to center position, with the circls slightly below head and kept in same formation
    head.x(center_pos.x - 400, 0.3),
    head.y(center_pos.y, 0.3),
    // x should be a function of the index of the circle, y should be right below head
    ...circs.map((circ, i) => circ.position([center_pos.x + 200 * i - 400, center_pos.y + 200], 0.3)),
    // update the circle size to double and text size to double as well for each circle
    // ...circs.map((circ, i) => circ.width(200, 0.3)),
    // ...circs.map((circ, i) => circ.height(200, 0.3)),
  )






  // add a circle to left of head ------------------------------------------------------------------------------------
  const dummyHead = createRef<Circle>();
  const dummyHeadText = createRef<Txt>();
  const dummyCircle = <Circle
    ref={makeRef(circs, 5)}
    width={100}
    height={100}
    scale={layout.scale()}
    x={circs[0].x()}
    y={circs[0].y()}
    stroke={'78909C'}
    fill={"#607D8B"}
    lineWidth={8}
    opacity={0}
  >
    <Txt
      ref={makeRef(Texts, 5)}
      opacity={() => text_opac()}
      fontFamily={'JetBrains Mono'}
      fill="FFFFFF"
    >-1</Txt>
  </Circle>

  yield* waitUntil('add dummy node and text')
  // move dummy circle to left of head and fade in
  yield* all(


  )


  // add circles, head and dummy head to a new layout named dummy_show
  const dummy_show = createRef<Layout>();
  // create new scale signal for dummy_show
  const dummy_scale = createSignal(1);
  const dummy_show_layout =
    <Layout
      ref={dummy_show}
      scale={() => dummy_scale()}
    >
    </Layout>




  core_layout.add(dummy_show_layout)


  dummy_show_layout.add(circs)
  dummy_show_layout.add(head)

  yield* dummy_scale(1.5, 0.5)

  // add the additional text and node circle
  const dummyheadRef = createRef<Txt>();

  const dummyheadtext =
    <Txt
      ref={dummyheadRef}
      fontFamily={'JetBrains Mono'}
      fontSize={48}
      fill={'white'}
      // same as head position
      position={{ x: headRef().position().x, y: headRef().position().y }}
    >Dummy</Txt>

  dummy_show_layout.add(dummyheadtext)
  dummy_show_layout.add(dummyCircle)

  // move dummy head text to the left right on of dummy circle

  yield* all(
    dummyCircle.position.x(circs[0].x() - circle_gap, 0.5),
    dummyCircle.opacity(1, 0.5),
    Texts[5].opacity(1, 0.5),
    dummyheadtext.x(headRef().x() - circle_gap, 0.5),
    dummyCircle.y(headRef().position().y + 200, 0.5)
  )

  // wait for 3 seconds
  yield* waitFor(1)


  // revert to previous list state, and do the same for each technique 


  // // question mark-----------------------------------------------------------------------------
  // // 
  // yield* waitUntil('question mark')

  // const qmarkRef = createRef<Img>();

  // core_layout.add(<Img ref={qmarkRef} src={question_mark} opacity={0} size={1600} />);

  // yield* all(
  //   qmarkRef().opacity(1, 0.5).to(0, 0.2),
  //   qmarkRef().absoluteRotation(0, 0.2).to(360, 0.2).to(0, 0.2)
  // )
  // qmarkRef().remove()
  // // yield* all(previewOpacity(1, 0.5), strOpacity(1, 0.5))

  // // yield* stringOpacity(1, 0.5)
  // yield* waitFor(0.5)


  // // codeblock------------------------------------------------------------------------------
  // //     yield* waitUntil('create codeblock')
  // //     yield view.add(
  // //           <Layout
  // //             ref={code_layout}
  // //             x={0}
  // //             y={0}
  // //             scale={() => scale()}
  // //           >
  // //             <CodeBlock
  // //                 language='python'
  // //                 ref={code}
  // //                 // scale={() => scale()}
  // //                 fontSize={24}
  // //                 lineHeight={36}
  // //                 x={codeBlockX}
  // //                 y={codeBlockY}
  // //                 shadowColor={"red"}
  // //                 fontFamily={'JetBrains Mono'}
  // //                 code={``}
  // //             />
  // //           </Layout>
  // //     );

  // //     // yield slideTransition(Direction.Left);
  // //     const placeholder = createRef<Node>();
  // // // ------------------------------------------------------------------------------------
  // // // insert comment code
  // //     yield* waitUntil('insert comment')

  // //     let comment_code = ``
  // //     let x = 0
  // //     for (const line of Code.codeBlocks) {
  // //         if (x < 5){
  // //           x+=1
  // //           yield* code().edit(0.4,false)
  // //           `${comment_code}${insert(line)}\n`
  // //           comment_code = comment_code +line + "\n"
  // //         }
  // //     }
  // //     // combine codeStrings into one string
  // //     let code_block = ``
  // //     for (const line of Code.codeStrings) {
  // //       code_block = code_block + line + "\n"
  // //     }
  // //     yield* waitUntil('insert codeblock')
  // //     yield* code().edit(0.7,false)`${comment_code}${insert(code_block)}\n`

  // //     // insert base case
  // //     // yield* code().selection(lines(5, 10),1)
  // //     yield* waitUntil('insert basecase')

  // //     let baseCase = ``
  // //     for (const line of Code.baseCase) {
  // //       yield* code().edit(0.5,false)
  // //       `${comment_code}${code_block}${baseCase}${insert(line)}\n`
  // //       baseCase = baseCase +line + "\n"
  // //     }

  // //     yield* waitUntil('highlight comments')
  // //     const highlight_rect = createRef<Rect>();
  // //     view.add(
  // //         <Rect
  // //           ref={highlight_rect}
  // //           width={50}
  // //           height={50}
  // //           x={-250}
  // //           y={400}
  // //           fill="silver"

  // //           opacity={0.5}
  // //           radius={10}
  // //         />
  // //     );
  // //     yield* waitUntil('remove comments')
  // //     scale(0.5,1)
  // //     yield* waitUntil('cursor animation')

  // // yield* code().edit(0.5,false)
  // // `${remove(comment_code)}${code_block}${baseCase}\n`



  // // Solution1------------------------------------------------------------------------------------
  // //



  // // Solution2------------------------------------------------------------------------------------
  // //


  // // Solution3------------------------------------------------------------------------------------
  // //



  // // complexity analysis------------------------------------------------------------------------------------
  // // 
  // // const TimeComplextyholder = createRef<CodeBlock>();
  // // // yield* code().opacity(0,0.5)
  // // core_layout.add(

  // //   <CodeBlock
  // //     ref={TimeComplextyholder}
  // //     fontSize={60}
  // //     x={headRef().position().x }
  // //     y={headRef().position().y+700}
  // //     code={`Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]
  // //     `}
  // //     fill={"white"}
  // //     language={"txt"}
  // //   />
  // // )
  // // yield * TimeComplextyholder().edit(0.5,false)`Time Complexity: O(n${remove('^2')})`;

});
