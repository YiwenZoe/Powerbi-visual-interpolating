/**
 * Developed by Yiwen Zhou
 */
import {
    BaseDescriptor,
    IDescriptor,
} from "./descriptor";

export enum LineInterpolation {
    linear = "linear",
    stepBefore = "step-before",
    stepAfter = "step-after",
    basis = "basis",
    basisOpen = "basis-open",
    basisClosed = "basis-closed",
    cardinal = "cardinal",
    cardinalOpen = "cardinal-open",
    cardinalClosed = "cardinal-closed",
    monotone = "monotone",
}

export enum LineStyle {
    solidLine = "solidLine",
    dottedLine = "dottedLine",
    dashedLine = "dashedLine",
    dotDashedLine = "dotDashedLine",
}

export enum LineType {
    line = "line",
    area = "area",
    column = "column",
}

export interface ILineDescriptorBase {
    fillColor: string;
    shouldMatchKpiColor: boolean;
    dataPointStartsKpiColorSegment: boolean;
    lineStyle: LineStyle;
    thickness: number;
    interpolation: LineInterpolation;
}

export class LineDescriptor
    extends BaseDescriptor
    implements IDescriptor, ILineDescriptorBase {

    public get opacity(): number {
        return this.convertOpacityToCssFormat(this.rawOpacity);
    }

    public get areaOpacity(): number {
        return this.convertOpacityToCssFormat(this.rawAreaOpacity);
    }

    public fillColor: string = undefined;
    public shouldMatchKpiColor: boolean = false;
    public dataPointStartsKpiColorSegment: boolean = true;
    public lineType: LineType = LineType.line;
    public thickness: number = 2;
    public rawOpacity: number = 100;
    public rawAreaOpacity: number = 50;
    public lineStyle: LineStyle = LineStyle.solidLine;
    public interpolation: LineInterpolation = LineInterpolation.linear;
    public interpolationWithColorizedLine: LineInterpolation = LineInterpolation.linear;

    private minThickness: number = 0.25;
    private maxThickness: number = 10;

    private minOpacity: number = 15;
    private maxOpacity: number = 100;

    public convertOpacityToCssFormat(opacity: number): number {
        return opacity / 100;
    }

    public getInterpolation(): LineInterpolation {
        return this.shouldMatchKpiColor
            ? this.interpolationWithColorizedLine
            : this.interpolation;
    }

    public parse(): void {
        this.thickness = Math.min(
            Math.max(
                this.minThickness,
                this.thickness,
            ),
            this.maxThickness,
        );

        this.rawOpacity = this.getOpacity(this.rawOpacity);
        this.rawAreaOpacity = this.getOpacity(this.rawAreaOpacity);
    }

    public shouldKeyBeEnumerated?(key: string): boolean {
        if (key === "interpolation" && this.shouldMatchKpiColor) {
            return false;
        }

        if (key === "interpolationWithColorizedLine" && !this.shouldMatchKpiColor) {
            return false;
        }

        if (key === "rawAreaOpacity" && this.lineType !== LineType.area) {
            return false;
        }

        if (key === "dataPointStartsKpiColorSegment" && !this.shouldMatchKpiColor) {
            return false;
        }

        return this.hasOwnProperty(key);
    }

    private getOpacity(opacity: number): number {
        return Math.min(
            this.maxOpacity,
            Math.max(
                this.minOpacity,
                opacity,
            ),
        );
    }
}