/**
 * Developed by Yiwen Zhou
 */import powerbiVisualsApi from "powerbi-visuals-api";

import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbiVisualsApi.DataView;

import DataViewTable = powerbiVisualsApi.DataViewTable;
import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
import DataViewCategorical = powerbiVisualsApi.DataViewCategorical;
import PrimitiveValue = powerbiVisualsApi.PrimitiveValue;
import DataViewValueColumnGroup = powerbiVisualsApi.DataViewValueColumnGroup;

export interface ValueTuple{
    approvalRate: number,
    index: number,
    monthName: string,
    toolTip: string
}
export interface DataPoint{
    x: number,
    y: number
}
export interface Domain{
    x: [number,number]
    y: [number,number]
}
export class TableDataParser{
    public data;
    public countryMap: Map<string,boolean>;
    public valueMap: Map<string,Array<ValueTuple>>;
    public domain: Domain;
    constructor(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        const table: DataViewTable = dataView.table;
        this.data = table.rows.length;
        const initalMap = new Map<string,Array<ValueTuple>>();
        this.countryMap = new Map<string,boolean>();
        this.valueMap = new Map<string,Array<ValueTuple>>();
        // for(let i=0;i<table.rows.length;i++){
        //     if(table.rows[i].length>3){
        //         this.countryMap.set(table.rows[i][2] as string,false);
        //     }
        // }
        this.domain = {
            x:[12,12],
            y:[0.9,0.95]
        }
        table.rows.forEach((row: DataViewTableRow) => {
            var value:ValueTuple = {
                approvalRate: row[0] as number,
                index: row[3] as number,
                monthName: row[4] as string,
                toolTip: row[5] as string
            }
            var key = row[1] + ',' + row[2]

            this.domain.x[0] = Math.min(this.domain.x[0],value.index)
            this.domain.x[1] = Math.max(this.domain.x[1],value.index)
            this.domain.y[0] = Math.min(this.domain.y[0],value.approvalRate)
            this.domain.y[1] = Math.max(this.domain.y[1],value.approvalRate)

            if(initalMap.has(key)){
                var prevValue = initalMap.get(key);
            }else{
                var prevValue = new Array<ValueTuple>();
            }

            this.countryMap.set(key,true);
            prevValue.push(value);
            initalMap.set(key,prevValue)
        })
        this.domain.x[0] -= 1
        this.domain.y[0] -= 0.01
        initalMap.forEach((value: ValueTuple[],key: string) =>{
            var sortedValue: ValueTuple[] = value.sort((v1:ValueTuple,v2:ValueTuple) => v1.index - v2.index);
            this.valueMap.set(key,sortedValue);
        })
    }
}