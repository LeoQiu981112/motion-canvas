import { Layout, Rect, Txt, Line } from "@motion-canvas/2d/lib/components";
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SimpleSignal } from "@motion-canvas/core/lib/signals";
import { Colors, WhiteLabel } from "../styles";

// LinkedList node interface
interface LinkedListNode<T> {
    value: T;
    next: LinkedListNode<T> | null;
}

// Properties for the linked list visualization
interface LinkedListProps<T> {
    nodes: LinkedListNode<T>[];
    // Add any additional properties you need here
}

// The LinkedList class
export class LinkedList<T> extends Layout {
    @initial([])
    @signal()
    public declare readonly nodes: SimpleSignal<LinkedListNode<T>[], this>;
    
    // Add any additional signals for interactivity or display settings

    // Constructor
    public constructor(props: LinkedListProps<T>) {
        super({
          ...props
      });
            this.buildLinkedList();
    }

    private buildLinkedList() {
        let currentNode = this.nodes();
        let xPos = 0; // Initial x position for the first node

        while (currentNode) {
            this.add(
                <Rect
                    width={60}
                    height={60}
                    fill={Colors.surfaceLight}
                    x={xPos}
                >
                    <Txt
                        {...WhiteLabel}
                        text={`${currentNode.value}`}
                    />
                </Rect>
            );

            // If there is a next node, draw a line pointing to the next node
            if (currentNode.next) {
                this.add(
                    <Line
                        x1={xPos + 60}
                        y1={30}
                        x2={xPos + 90}
                        y2={30}
                        stroke={Colors.surface}
                        strokeWidth={2}
                    />
                );
            }

            // Increment the x position for the next node
            xPos += 90; // Adjust the value to manage the spacing between nodes
            currentNode = currentNode.next;
        }
    }
}
