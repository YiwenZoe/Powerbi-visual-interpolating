/**
 * Developed by Yiwen Zhou
 */

// import powerbiVisualsApi from "powerbi-visuals-api";

// import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
// import DataView = powerbiVisualsApi.DataView;

// import DataViewTable = powerbiVisualsApi.DataViewTable;
// import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
// import DataViewCategorical = powerbiVisualsApi.DataViewCategorical;
// import PrimitiveValue = powerbiVisualsApi.PrimitiveValue;
// import DataViewValueColumnGroup = powerbiVisualsApi.DataViewValueColumnGroup;


// interface DataPoint{
//     x: number,
//     y: number,
// }
// export interface CountryList{
//     countries: Map<string,boolean>
// }
// export interface ColorSettings{
//     lineColors: Array<string>,
//     scatterColors: Array<string>
// }

// export interface CanvasSettings{
//     title:  string,
//     domains:{
//         x: [number, number],
//         y: [number, number]
//     },
//     canvas?:{
//         height: number,
//         width: number
//     },
//     sizes:{
//         lines:Array<number>,
//         scatters:Array<number>,
//         tickLabels: number
//     }
// }

// export interface LineDatas{
//     lineDatas: Array<Array<DataPoint>>,
//     countries: Array<string>
// }
// export class CateDataParser{

//     public colorSettings:ColorSettings;
//     public canvasSettings: CanvasSettings;
//     public lineDatas:LineDatas;
//     public countryList: CountryList;
//     constructor(options: VisualUpdateOptions) {
//         const dataView: DataView = options.dataViews[0];
//         const cate: DataViewCategorical = dataView.categorical;
//         // console.log(cate.categories[0].values[0].toString().replace(/\s+/g,""))
//         const metaData = JSON.parse(cate.categories[0].values[0].toString().replace(/\s+/g,""));
//         console.log(metaData);
//         this.colorSettings = {
//             lineColors: [],
//             scatterColors: []
//         };
//         this.lineDatas = {
//             lineDatas:[],
//             countries: []
//         };
//         this.countryList = {
//             countries: new Map<string,boolean>()
//         }
//         const {colors, data, sizes, domains, title, canvas,} = metaData[0];


//         this.colorSettings.lineColors = colors[0].lines;
//         this.colorSettings.scatterColors = colors[0].scatters;
//         this.canvasSettings = {
//             title:  title,
//             domains:{
//                 x: domains.x,
//                 y: domains.y
//             },
//             canvas:{
//                 height: canvas.height,
//                 width: canvas.width
//             },
//             sizes:{
//                 lines: sizes.lines,
//                 scatters:sizes.scatters,
//                 tickLabels: sizes.tickLabels
//             }
//         }
//         for(let i=0;i<data.x.length;i++){
//             var lineData = new Array<DataPoint>();
//             for(let j=0;j<data.x[i].length;j++){
//                 var dataPoint:DataPoint = {
//                     y:data.x[i][j],
//                     x:data.y[i][j],
//                 }
//                 lineData.push(dataPoint)
//             }
//             this.countryList.countries.set(data.Country[i],false);
//             this.lineDatas.countries.push(data.Country[i]);
//             this.lineDatas.lineDatas.push(lineData);
//         }
//     }
// }