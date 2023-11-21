import { Layout, makeScene2D,CubicBezier,Path } from "@motion-canvas/2d";
import { Line, Rect, Node,Ray,Circle,Txt,Img } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert,remove, lines,range as crange } from "@motion-canvas/2d/lib/components/CodeBlock";
import {all, waitFor,waitUntil,delay, makeRef, range, chain, BBox, sequence} from '@motion-canvas/core';
import { createSignal } from "@motion-canvas/core/lib/signals";
import { slideTransition,zoomInTransition,zoomOutTransition,fadeTransition  } from "@motion-canvas/core/lib/transitions";
import { Direction } from "@motion-canvas/core/lib/types";
import { createRef, useLogger, useScene } from "@motion-canvas/core/lib/utils";
import { Array, Quote, xAlign, yAlign } from "../components/array";
import { Colors } from '../styles'
import { Tab } from '../../../packages/ui/src/components/tabs/Tabs';
import * as Code from '../code_files/code_to_add';
import { borderHighlight } from '../../../packages/ui/src/components/animations/borderHighlight';
import { Color } from 'chroma-js';
import {   PlopSpring,SmoothSpring,spring, } from '../../../packages/core/src/tweening';
import { formatDuration } from '../../../packages/ui/src/utils/formatDuration';
import question_mark from '../images/question_mark.png';
import q1 from '../images/problem1.png';
import q2 from '../images/problem2.png';

import { fillRect } from '../../../packages/2d/src/utils/CanvasUtils';
import { effect } from '@preact/signals';
import image from '/@fs/${base}';


export default makeScene2D(function* (view) {
    // const scale = 75;
    const scale = createSignal(1);
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

    const core_layout_ref = createRef<Layout>();
    const core_layout =
      <Layout
        ref={core_layout_ref}
        scale={() => scale()}
      >
      </Layout>

    view.add(core_layout)

    core_layout.add(
        <Node x={400} ref={preview} opacity={() => previewOpacity()}>
            <Line
                points={() => {
                    if(index() == -1) return [[0, 0], [0, 0]];
                    let x = stringArray().getIndexBox(0).position().x;
                    let i = Math.round(index());
                    useLogger().info(i+" " + index().toFixed(2))
                    let newPos = strArray().getIndexBox(i+1);

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
    const titleref = createRef<CodeBlock>();

    core_layout.add(
        <Layout layout ref={layoutref} gap={10} padding={10} direction={"column"} x={-800} y={400}>
            <Img ref={problem1} src={q1}  />
            <Img ref={problem2} src={q2}  />
        </Layout>
    );

    yield* fadeTransition(1)

    yield* waitFor(0.5)
    const headRef= createRef<Txt>();

    const head = 
    <Txt
      ref={headRef}
      fontFamily={'JetBrains Mono'}
      fontSize={48}
      fill={'white'}
      opacity={0}
      position={{ x: -1550, y: -450 }} 
    >Head</Txt>
    core_layout.add(
      head
    )


// ------------------------------------------------------------------------------------
    // rect stuff
    // Run all of the generators.
    // Create some rects
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
          y={headRef().position().y+200}
          stroke={'78909C'}
          fill={"#607D8B"}
          lineWidth={8}
          startAngle={0}
          endAngle={0}
        >
          <Txt
           ref = {makeRef(Texts,i)}
           opacity={() => text_opac()}
           fontFamily={'JetBrains Mono'}
           fill="FFFFFF"
          >{i+1}</Txt>
        </Circle>
      ))

    layout.add(circles)

    core_layout.add(layout)
  


    yield* waitUntil('move circles')




    const moveCirc = [];
    let counter = 0
    const spread = []
    for (const circ of circs){
      spread.push(circ.x(800  + 200*counter,0.3*counter))
      spread.push(circ.endAngle(360, 1.5))
      counter+=1
      spread.push(text_opac(counter/5,0.2*counter))

    }

    for (const circ of circs) {
      // No yield here, just store the generators.
      moveCirc.push(circ.position.y(50, 0.5).to(-50, 0.5).to(0, 0.5));
    }
    yield* all(
      head.x(800,1),
      head.opacity(1,1.5),
      layout.opacity(1,0.5),
      ...spread)


    // yield* all(...moveCirc);

    yield* waitUntil('move question down')
    yield* layoutref().y(-1200,1)

    // quickly talk about constraint 
    yield* waitUntil('remove questions')
    // move problem1 and 2 out at the same time
    yield* all(layoutref().x(-2000,1))

    // yield* core_layout_ref().x(-1200, 1)

    yield* problem1().remove()
    yield* problem2().remove()



    yield* waitUntil('question mark')
    
    const qmarkRef = createRef<Img>();
    const problem3 = createRef<Img>();

    core_layout.add(<Img ref={qmarkRef} src={question_mark}  opacity={0} size={1600} />);

    yield* all(
      qmarkRef().opacity(1,0.5).to(0,0.2),
      qmarkRef().absoluteRotation(0, 0.2).to(360, 0.2).to(0, 0.2)
    )
    qmarkRef().remove()
    // yield* all(previewOpacity(1, 0.5), strOpacity(1, 0.5))

    // yield* stringOpacity(1, 0.5)
    yield* waitFor(0.5)
    yield* waitUntil('show techniques')
    // create text "Linked List"
    const linkedListRef = createRef<CodeBlock>();
    let text = "Linked List\n\n traversal\n\n Dummy head\n\n Two pointer\n\n In place revsersal\n";
    const linkedList = <CodeBlock ref={linkedListRef} fontFamily={'JetBrains Mono'} fontSize={96} fill={'white'} position={{ x: -1200, y: -1600 }} >{text}</CodeBlock>
    core_layout.add(linkedList)
    // move linkedlist down
    yield* linkedListRef().y(-300,1)

    // yield* linkedListRef().fontSize(100,0.5)




// // ------------------------------------------------------------------------------------
// // codeblock
//     yield* waitUntil('create codeblock')
//     yield view.add(
//           <Layout
//             ref={code_layout}
//             x={0}
//             y={0}
//             scale={() => scale()}
//           >
//             <CodeBlock
//                 language='python'
//                 ref={code}
//                 // scale={() => scale()}
//                 fontSize={24}
//                 lineHeight={36}
//                 x={codeBlockX}
//                 y={codeBlockY}
//                 shadowColor={"red"}
//                 fontFamily={'JetBrains Mono'}
//                 code={``}
//             />
//           </Layout>
//     );

//     // yield slideTransition(Direction.Left);
//     const placeholder = createRef<Node>();
// // ------------------------------------------------------------------------------------
// // insert comment code
//     yield* waitUntil('insert comment')

//     let comment_code = ``
//     let x = 0 
//     for (const line of Code.codeBlocks) {
//         if (x < 5){
//           x+=1
//           yield* code().edit(0.4,false)
//           `${comment_code}${insert(line)}\n`
//           comment_code = comment_code +line + "\n"
//         }
//     }
//     // combine codeStrings into one string
//     let code_block = ``
//     for (const line of Code.codeStrings) {
//       code_block = code_block + line + "\n"
//     }
//     yield* waitUntil('insert codeblock')
//     yield* code().edit(0.7,false)`${comment_code}${insert(code_block)}\n`

//     // insert base case
//     // yield* code().selection(lines(5, 10),1)
//     yield* waitUntil('insert basecase')

//     let baseCase = ``
//     for (const line of Code.baseCase) {
//       yield* code().edit(0.5,false)
//       `${comment_code}${code_block}${baseCase}${insert(line)}\n`
//       baseCase = baseCase +line + "\n"
//     }

//     yield* waitUntil('highlight comments')
//     const highlight_rect = createRef<Rect>();
//     view.add(
//         <Rect
//           ref={highlight_rect}
//           width={50}
//           height={50}
//           x={-250}
//           y={400}
//           fill="silver"
          
//           opacity={0.5}
//           radius={10}
//         />
//     );
//     yield* waitUntil('remove comments')
//     scale(0.5,1)
//     yield* waitUntil('cursor animation')

    // yield* code().edit(0.5,false)
    // `${remove(comment_code)}${code_block}${baseCase}\n`

// Solution1
// ------------------------------------------------------------------------------------
// Solution2
// ------------------------------------------------------------------------------------
// Solution3
// ------------------------------------------------------------------------------------

// complexity analysis
// ------------------------------------------------------------------------------------
    // const TimeComplextyholder = createRef<CodeBlock>();
    // // yield* code().opacity(0,0.5)
    // core_layout.add(

    //   <CodeBlock
    //     ref={TimeComplextyholder}
    //     fontSize={60}
    //     x={headRef().position().x }
    //     y={headRef().position().y+700}
    //     code={`Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]
    //     `}
    //     fill={"white"}
    //     language={"txt"}
    //   />
    // )
    // yield * TimeComplextyholder().edit(0.5,false)`Time Complexity: O(n${remove('^2')})`;

});
