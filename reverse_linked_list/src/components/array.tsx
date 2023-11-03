import { Layout, LayoutProps, Node, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { ColorSignal } from "@motion-canvas/core/lib/types";
import { makeRef } from "@motion-canvas/core/lib/utils";
import { Colors, BlackLabel, WhiteLabel } from "../styles";

export enum Quote {
    single = "'",
    double = "\"",
    tick = "`",
    none = ""
}
export enum yAlign { top, bottom }
export enum xAlign { left, right }

export interface NameAlignment {
    x: xAlign
    y: yAlign
}

export interface LabeledArray {
    [key: string]: string|number
}


export const isArrayObject = (checkObj: number[] | string[] | LabeledArray): checkObj is LabeledArray => {
    if((checkObj as LabeledArray) !== undefined) {
        return true;
    } 
    return false;
}

export interface ArrayProps extends LayoutProps {
    values?: SignalValue<number[] | string[] | LabeledArray>;
    quoteChars?: SignalValue<string|Quote>;

    invertColors?: SignalValue<boolean>;
    nameAlignment?: SignalValue<NameAlignment>;
    highlightIndexes?: SignalValue<number[]>;
    
    highlightColor?: SignalValue<string>;
    
    suffixColor?: SignalValue<string>;
    suffix?: SignalValue<string>;
    name?: SignalValue<string>;
}

export class Array extends Layout {
    @initial([])
    @signal()
    public declare readonly values: SimpleSignal<number[] | string[] | {[key: string] : string|number}, this>

    @initial(Quote.single)
    @signal()
    public declare readonly quoteChars: SimpleSignal<Quote, this>

    @initial(false)
    @signal()
    public declare readonly invertColors: SimpleSignal<boolean, this>
    
    @initial({x: xAlign.left, y: yAlign.top})
    @signal()
    public declare readonly nameAlignment: SimpleSignal<NameAlignment, this>

    @initial([])
    @signal()
    public declare readonly highlightIndexes: SimpleSignal<number[], this>

    @initial(Colors.red)
    @signal()
    public declare readonly suffixColor: ColorSignal<this>

    @initial("[]")
    @signal()
    public declare readonly suffix: SimpleSignal<string, this>
    
    @initial("array")
    @signal()
    public declare readonly name: SimpleSignal<string, this>

    public readonly arrayContainer: Rect;
    public readonly arrayName: Layout;
    public readonly boxArray: Node[] = [];

    public getIndexBox(index: number) {
        return this.boxArray[index]
    }

    public constructor(props?: ArrayProps) {
        super({
            ...props
        });
        
        let arrayObject = this.values()

        if(isArrayObject(arrayObject)) {
            let i = 0;
            for (const [key, value] of Object.entries(arrayObject)) {
                let dark = Colors.background;
                let light = Colors.surfaceLight;

                let whiteLabel = WhiteLabel;
                let blackLabel = BlackLabel;

                if(this.highlightIndexes().includes(i)) {
                    [whiteLabel, blackLabel] = [blackLabel, whiteLabel];
                    [light, dark] = [dark, light]
                }

                if(this.invertColors()) {
                    [whiteLabel, blackLabel] = [blackLabel, whiteLabel];
                    [light, dark] = [dark, light]
                }

                this.boxArray.push(
                    <Rect
                        radius={5}
                        width={60}
                        height={60}
                        fill={light}
                        gap={12}
                        padding={15}
                        justifyContent="start"
                        alignItems="center"
                        direction="column"
                    >
                        <Txt
                            
                            {...blackLabel}
                            lineHeight={blackLabel.fontSize+2}
                            text={`${this.quoteChars()}${value}${this.quoteChars()}`}
                        />
                        <Txt
                            lineHeight={WhiteLabel.fontSize}
                            {...WhiteLabel}
                            fontSize={blackLabel.fontSize / 1.5}
                            text={`${key.toUpperCase()}`}
                        />
                    </Rect>
                )
                i++;
            }
        } else {
            for(let i = 0; i < this.values().length; i++) {
                let dark = Colors.background;
                let light = Colors.surfaceLight;

                let whiteLabel = WhiteLabel;
                let blackLabel = BlackLabel;

                if(this.highlightIndexes().includes(i)) {
                    [whiteLabel, blackLabel] = [blackLabel, whiteLabel];
                    [light, dark] = [dark, light]
                }

                if(this.invertColors()) {
                    [whiteLabel, blackLabel] = [blackLabel, whiteLabel];
                    [light, dark] = [dark, light]
                }

                this.boxArray.push(
                    <Rect
                        radius={5}
                        width={60}
                        height={60}
                        fill={light}
                        gap={12}
                        padding={15}
                        justifyContent="start"
                        alignItems="center"
                        direction="column"
                    >
                        <Txt
                            
                            {...blackLabel}
                            lineHeight={blackLabel.fontSize+2}
                            text={`${this.quoteChars()}${(this.values() as any[])[i]}${this.quoteChars()}`}
                        />
                        <Txt
                            lineHeight={WhiteLabel.fontSize}
                            {...WhiteLabel}
                            fontSize={blackLabel.fontSize / 1.5}
                            text={`${i}`}
                        />
                    </Rect>
                )
            }
        }

        this.add(
            <>
                <Rect
                    ref={makeRef(this, 'arrayContainer')}
                    width={null}
                    height={100}
                    direction='row'
                    padding={20}
                    gap={20}
                    fill={Colors.surface}
                    radius={20}
                    layout
                >
                    {this.boxArray}
                </Rect>

                <Layout
                    ref={makeRef(this, 'arrayName')}
                    direction='row'
                    gap={10}
                    layout
                    offsetX={() => this.nameAlignment().x == xAlign.left ? -1 : 1}
                    x={() => {
                        if(this.nameAlignment().x == xAlign.left) {
                            return -this.arrayContainer.size().x/2 +20
                        } else {
                            return this.arrayContainer.size().x/2 - 20
                        }
                    }}
                    y={() => {
                        if(this.nameAlignment().y == yAlign.top)
                            return this.arrayContainer.position().y - this.arrayContainer.size().y + 25
                        else {
                            return this.arrayContainer.position().y + this.arrayContainer.size().y - 25
                        }
                    }}
                >
                <Txt
                    {...WhiteLabel}
                    text={this.name()}

                />
                <Txt
                    {...WhiteLabel}
                    fill={this.suffixColor()}
                    text={this.suffix()}
                />
                </Layout>
            </>
        )
        
    }
}