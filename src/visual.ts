/**
 * Developed by Yiwen Zhou
 */"use strict";
import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import powerbiVisualsApi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbiVisualsApi.extensibility.visual.IVisual;
import DataView = powerbiVisualsApi.DataView;
import DataViewTable = powerbiVisualsApi.DataViewTable;
import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
import IViewport = powerbiVisualsApi.IViewport;

import VisualObjectInstance = powerbiVisualsApi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbiVisualsApi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbiVisualsApi.VisualObjectInstanceEnumeration;

import { ReactCircleCard, initialState } from "./component";
import { VisualSettings } from "./settings/settings";


import {createInterpolatorWithFallback} from "commons-math-interpolation";
import  bezier  from '@turf/bezier-spline';
import { lineString } from '@turf/helpers';
import "./../style/visual.less";
import {TableDataParser} from "./tableDataParser";
// import {CateDataParser,ColorSettings,LineDatas} from "./cateDataParser";
export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;

    private settings: VisualSettings;
    private viewport: IViewport;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);
    }
    public update(options: VisualUpdateOptions) {
        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];
            const parser: TableDataParser = new TableDataParser(options);
            this.viewport = options.viewport;
            this.settings = VisualSettings.parse<VisualSettings>(dataView);

            ReactCircleCard.update({
                // companyMap: parser.visited,
                // dateMap: parser.dateMap,
                // cols: parser.cols,
                // rows: parser.rows,
                // testRows: parser.testRows,
                // maxLength: parser.maxLength,
                // loading: parser.loading,
                // progress: parser.progress
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }
}