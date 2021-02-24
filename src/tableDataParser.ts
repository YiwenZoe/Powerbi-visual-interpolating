/**
 * Developed by Yiwen Zhou
 */
import powerbiVisualsApi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbiVisualsApi.DataView;
import DataViewTable = powerbiVisualsApi.DataViewTable;
import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
import {ColDef} from '@material-ui/data-grid';
import {VictoryLine} from 'victory';
export interface CompanyData{
    index: number,
    name: string,
    data: Map<string,number>
}
const monthToIndexMap = new Map<string,string>([
    ["January","01"],
    ["November","11"],
    ["December","12"]
]);

export class TableDataParser{

    public visited: Map<string,CompanyData>;
    public dateMap: Map<string,string>;
    public cols: Array<string>;
    public rows: Array<string>;
    public testRows: Array<Map<string,string>>;
    public maxLength: number;
    public loading: boolean;
    public progress: number;
    constructor(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        const table: DataViewTable = dataView.table;
        const rows = table.rows;
        const columns = table.columns;
        const data = new Array<CompanyData>();
        const columnIndex = new Map<string,number>();
        var visited = new Map<string,CompanyData>();
        var visitedDate = new Map<string,string>();
        this.dateMap = new Map<string,string>();
        var mycol = ['name']
        this.testRows = new Array<Map<string,string>>()
        var myrow: Array<any> = new Array<any>();
        this.loading = columns.length < 7;
        this.progress = columns.length / 7 * 100;
        for(let i=0;i<columns.length;i++){
            columnIndex.set(columns[i].displayName,i);
        }
        for(let i=0;i<rows.length;i++){
            var year = rows[i][columnIndex.get("Year") as number] as string
            var monthString  = rows[i][columnIndex.get("Month") as number] as string
            var month = monthToIndexMap.get(monthString)

            var day = rows[i][columnIndex.get("Day") as number] as string
            var companyName = rows[i][columnIndex.get("PI Type") as number] as string
            var index = rows[i][columnIndex.get("Index") as number] as number
            var value = rows[i][columnIndex.get("Value") as number] as number
            var dateString = year + "-" + month + "-" + day

            if(!visited.has(companyName)){
                var curMap = new Map<string,number>()
            }else{
                var curMap = visited.get(companyName).data;
            }
            var comp: CompanyData = {
                index: index,
                name: companyName,
                data: curMap
            }
            visited.set(companyName, comp)
            curMap.set(dateString, value)

            this.dateMap.set(dateString,monthString + year + day)
        }
        var maxLength = 0
        visited.forEach((value,key) => {
            var row = {id: value.name}
            var testRow = new Map<string,string>();

            value.data.forEach((v,k) => {
                var dateString = this.dateMap.get(k)
                row[dateString] = 0
                testRow.set(k, (v*100).toFixed(2) + "%")
            })
            this.testRows.push(testRow);
            maxLength = Math.max(maxLength, testRow.size)
            myrow.push(key)
        })

        this.dateMap.forEach((v,k) => {
            mycol.push(k)
            if(mycol.length == 4){
                mycol.push('Trend')
            }
        })
        mycol.push('Trend')
        this.visited = visited
        this.cols = mycol
        this.rows = myrow
        this.maxLength = maxLength
    }
}