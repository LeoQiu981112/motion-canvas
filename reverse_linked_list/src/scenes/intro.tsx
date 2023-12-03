import { Layout, makeScene2D } from "@motion-canvas/2d";
import { Line, Rect, Node } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert, lines, range } from "@motion-canvas/2d/lib/components/CodeBlock";
import { all, waitFor, waitUntil, sequence } from "@motion-canvas/core/lib/flow";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { slideTransition } from "@motion-canvas/core/lib/transitions";
import { Direction } from "@motion-canvas/core/lib/types";
import { createRef, useLogger, useScene } from "@motion-canvas/core/lib/utils";
import { Array, Quote, xAlign, yAlign } from "../components/array";
import { Colors } from '../styles'
const code_block = `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    # theres two parts to this solution, 
    # reverse a list of size 0-1, reverse a list of size 2+
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # base case, if length of list is 1
        if not head:
            return None

        # if length is list is 2
        if head.next == None:
            return head
        
        returned_head = self.reverseList(head.next)

        # ------------------------------------------ 
        # second last node, as we just returned from the last node with
        # condition 2
        head.next.next = head
        head.next = None
        # 2 or more nodes, return value
        return returned_head

        # iterative
        # you should be able to return as it is if there are no
        # additional returned calls`
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



    const index = createSignal(1);
    view.add(
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


    const select_l_start = createSignal(1);
    const select_l_end = createSignal(1);
    const select_c_start = createSignal(1);
    const select_c_end = createSignal(1);
    const radius = createSignal(1);

    const dynamic_range = createSignal(() => {
        return range(
            select_l_start(), // starting on the first line
            select_c_start(), // starting with the 5th character
            select_l_end(), // ending on the first line
            select_c_start(), // ending with the 9th character
            ) 
    });
    
    const codee = <CodeBlock
    language='python'
    selection={dynamic_range()}
    ref={code}
    fontSize={4}
    lineHeight={6}
    fontFamily={'JetBrains Mono'}

    // x={-960 / 2}
    code={code_block}
/>
    yield view.add(
        <>
          <Layout
            ref={code_layout}
            x={0}
            y={0}
            scale={() => scale()}
            width={480}
            height={270}
          >
            {codee}
          </Layout>
        </>,
    );

    // yield* slideTransition(Direction.Bottom, 0.4);
    yield* waitUntil('what');

    // zooming in on code
    yield* scale(10, 0.8);
    yield* waitUntil('run through each');

    for (let i = 0; i < 20; i++) {
        // increase line end and character end
        select_l_end(select_l_end() + 3)
        select_c_end(select_c_end() + 1)
        // wait for 0.2 seconds
        yield* waitFor(0.05);
        code().selection(dynamic_range())
  
      }

    yield* waitUntil("end");

});
