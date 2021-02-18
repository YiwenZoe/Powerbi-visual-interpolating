/**
 * Developed by Yiwen Zhou
 */
"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import {LineDescriptor} from './descriptors/lineDescriptors';
import {SettingsBase} from './settingsBase';
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
export class GeoSettings {
    public LineWidth: number = 2;
    public ScatterSize: number = 2;
    public CanvasWidth: number = 400;
    public CanvasHeight: number = 200;
    public Interpolation: LineInterpolation = LineInterpolation.linear
}


export class VisualSettings extends SettingsBase {
    public geoSetting: GeoSettings = new GeoSettings();
}

