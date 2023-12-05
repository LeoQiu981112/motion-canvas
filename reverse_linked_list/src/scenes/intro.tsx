import { Layout, makeScene2D } from "@motion-canvas/2d";
import { Line, Rect, Node } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert, lines, range } from "@motion-canvas/2d/lib/components/CodeBlock";
import { all, waitFor, waitUntil, sequence } from "@motion-canvas/core/lib/flow";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { slideTransition,zoomOutTransition } from "@motion-canvas/core/lib/transitions";
import { Direction } from "@motion-canvas/core/lib/types";
import { createRef, useLogger, useScene } from "@motion-canvas/core/lib/utils";
import { Array, Quote, xAlign, yAlign } from "../components/array";
import {  delay, makeRef,chain, BBox } from '@motion-canvas/core';

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
    const layout_scale = createSignal(1);
    const core_scale = createSignal(1);
  
    const core_layout_ref = createRef<Layout>();
    const core_layout =
      <Layout
        ref={core_layout_ref}
        scale={() => core_scale()}
      >
      </Layout>
  
    view.add(core_layout)


    // const scale = 75;
    const scale = createSignal(1);
    const code = createRef<CodeBlock>();
    const code_layout = createRef<Layout>();
    const preview = createRef<Node>();

    const strArray = createRef<Array>();
    const stringArray = createRef<Array>();


    const select_l_start = createSignal(1);
    const select_l_end = createSignal(1);
    const select_c_start = createSignal(1);
    const select_c_end = createSignal(1);

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
    yield core_layout.add(
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

    for (let i = 0; i < 10; i++) {
        // increase line end and character end
        select_l_end(select_l_end() + 3)
        select_c_end(select_c_end() + 1)
        // wait for 0.2 seconds
        yield* waitFor(0.1);
        code().selection(dynamic_range())
  
      }
    
      yield* waitUntil('return');
      yield* core_scale(0.01, 0.8);
    view.removeChildren();


});
