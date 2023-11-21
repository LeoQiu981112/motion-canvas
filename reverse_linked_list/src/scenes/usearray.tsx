import { makeScene2D } from "@motion-canvas/2d";
import { Line, Rect, Node } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert, lines, range } from "@motion-canvas/2d/lib/components/CodeBlock";
import { all, waitFor, waitUntil } from "@motion-canvas/core/lib/flow";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { slideTransition } from "@motion-canvas/core/lib/transitions";
import { Direction } from "@motion-canvas/core/lib/types";
import { createRef, useLogger, useScene } from "@motion-canvas/core/lib/utils";
import { Array, Quote, xAlign, yAlign } from "../components/array";
import { Colors } from '../styles'

export default makeScene2D(function* (view) {
    const scale = 75;
    const code = createRef<CodeBlock>();
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

    yield view.add(
        <>
            <Rect
                // layout
                offset={-1}
                x={-960 + 80}
                y={-540 + 80}
                height={1080 - 160}
                width={960}
                clip
            >
                <CodeBlock
                    language='python'
                    selection={[
                        [
                            [0, 0],
                            [8, 100],
                        ],
                    ]}
                    ref={code}
                    fontSize={24}
                    lineHeight={36}
                    offsetX={-1}
                    fontFamily={'JetBrains Mono'}

                    x={-960 / 2}
                    code={`fn main() {\n\n};`}
                />
            </Rect>
        </>,
    );

    yield* slideTransition(Direction.Bottom, 1);
    yield* waitUntil('define_str');
    yield* code().selection(lines(1), 0.3);
    yield* code().edit(0.8)`fn main() {
    ${insert(`let hello = "Hello";`)}
};`;
    
    yield* waitUntil('type_str');
    yield* code().selection(lines(-1), 0.3)
    
    yield* code().edit(1.2, true)`fn main() {
    let hello${insert(`: &Str`)} = "Hello";
};`;

    yield* waitUntil('memory_str')
    yield* all(previewOpacity(1, 0.5), strOpacity(1, 0.5))

    yield* waitUntil('define_string')
    yield* code().edit(1.2)`fn main() {
    let hello: &Str = "Hello";${insert(`
    let greeting = String::from(hello);`)}
};`;

    yield* waitUntil('memory_representation')
    yield* stringOpacity(1, 0.5)
    yield* waitFor(0.5)
    yield* all(code().selection(range(1, 24, 1, 25), 0.3), lineOpacity(1, 0.5))

    yield* waitUntil("end")
    useScene().enterCanTransitionOut();
});
