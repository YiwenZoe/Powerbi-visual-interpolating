/**
 * Developed by Yiwen Zhou
 */import * as React from "react";
import powerbiVisualsApi from "powerbi-visuals-api";
import DataViewTable = powerbiVisualsApi.DataViewTable;
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';



import {
    VictoryChart,VictoryTheme,VictoryLine,VictoryScatter,VictoryLabel,VictoryBar,VictoryTooltip,VictoryAxis,VictoryLegend,Flyout
} from "victory";

import {ValueTuple,DataPoint, Domain} from "./tableDataParser";
import {LineDescriptor} from './settings/descriptors/lineDescriptors';
const colors = ['#e40017','#f4c983','#5b6d5b','#484018','#ffcb91','#ffefa1','#94ebcd','#6ddccf']
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
const LightTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
export interface State {
    selected: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
    // colorSettings: ColorSettings,
    // lineDatas: LineDatas,
    // canvasSettings: CanvasSettings,
    lineValue:number,
    pointValue:number,
    canvasWidth: number,
    canvasHeight: number,
    // countryList: Map<string,boolean>,
    countryMap: Map<string,boolean>,
    valueMap: Map<string,Array<ValueTuple>>,
    lineSetting: LineInterpolation,
    domain: Domain
}

export const initialState: State = {
    selected: "natural",
    // colorSettings:{
    //     lineColors: [],
    //     scatterColors: []
    // },
    // lineDatas:{
    //     lineDatas:[],
    //     countries: []
    // },
    // canvasSettings:{
    //     title:  "This is a interpolating tool",
    //     domains:{
    //         x: [-10,10],
    //         y: [-10,10]
    //     },
    //     canvas:{
    //         height: 200,
    //         width: 400
    //     },
    //     sizes:{
    //         lines:[],
    //         scatters:[],
    //         tickLabels: 10
    //     }
    // },
    lineValue:2,
    pointValue:2,
    canvasHeight: 200,
    canvasWidth: 400,
    // countryList: new Map<string,boolean>(),
    countryMap: new Map<string,boolean>(),
    valueMap: new Map<string,ValueTuple[]>(),
    lineSetting: LineInterpolation.linear,
    domain: {
        x:[0,12],
        y:[0.8,1]
    }
}
const cartesianInterpolations = [
    "basis",
    "bundle",
    "cardinal",
    "catmullRom",
    "linear",
    "monotoneX",
    "monotoneY",
    "natural",
    "step",
    "stepAfter",
    "stepBefore"
  ];
  
  const polarInterpolations = [
    "basis",
    "cardinal",
    "catmullRom",
    "linear"
  ];
export class ReactCircleCard extends React.Component<{}, State>{

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if(typeof ReactCircleCard.updateCallback === 'function'){
            ReactCircleCard.updateCallback(newState);
        }
    }

    public state: State = initialState;

    constructor(props: any){
        super(props);
        this.state = initialState;
    }

    public componentWillMount() {
        ReactCircleCard.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public onchange(value) {
        // console.log(value);
    }

    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }
    public handleSelect(event: React.ChangeEvent<{ value: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore" }>) {
        this.setState({
            selected: event.target.value as "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
        })
      }
    
    public handleCheck(event: React.ChangeEvent<HTMLInputElement>){
        console.log("Test checked",event.target)
        const nextRows = new Map(this.state.countryMap)
        nextRows.set(event.target.name,event.target.checked)
        this.setState({
            countryMap:nextRows
        })
    }
    render(){
        // const {  colorSettings,lineDatas,selected } = this.state;
        // const {colorSettings,selected,lineDatas,canvasSettings,lineValue,pointValue, canvasHeight, canvasWidth, countryList,data} = this.state;
        const {countryMap,valueMap,domain, selected, lineValue, pointValue, canvasHeight, canvasWidth} = this.state
        var countryLineDataMap = new Map<string,Array<DataPoint>>();
        var monthNameMap = new Map<number, string>();
        var tooltipMap = new Map<number,string>();
        var ct = 0;
        valueMap.forEach((value: ValueTuple[], key: string) => {
            var LineData: Array<DataPoint> = new Array<DataPoint>();
            value.forEach((v: ValueTuple) => {
                tooltipMap.set(v.approvalRate,v.toolTip);
                monthNameMap.set(v.index,v.monthName);
                LineData.push({
                    x: v.index,
                    y: v.approvalRate
                })
            })
            countryLineDataMap.set(key,LineData)
        })
        var AxisTick = [];
        for(let i=1;i<13;i++){
            console.log("This is data",monthNameMap)
            AxisTick.push(monthNameMap.get(i));
        }
        

        const lines = [];
        const scatters = [];

        const checkBoxes = [];
        const legendData = [];
        countryMap.forEach((value:boolean,key:string) => {
            checkBoxes.push(
                <FormControlLabel
                    control={<Checkbox checked={countryMap.get(key)} onChange={this.handleCheck.bind(this)} name={key} />}
                    label={key}
                />
            )
        })
        valueMap.forEach((value: ValueTuple[], key: string) => {
            
                legendData.push({
                    name:key, symbol: {fill: colors[ct]}
                })
                lines.push(  
                    <VictoryLine
                        style={{
                            parent: { border: "1px solid #ccc"},
                            data: {strokeWidth: lineValue,stroke: colors[ct]}
                        }}
                        data={countryLineDataMap.get(key)}
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 1000 }
                        }}
                        interpolation={selected}
                    />)
                scatters.push(
                    <VictoryScatter
                    style={{ data: {opacity: ({ datum }) => datum.opacity || 1, fill: colors[ct]} }}
                    data={countryLineDataMap.get(key)}
                    size={pointValue}
                    labels={({ datum }) => tooltipMap.get(datum.y)}
                    labelComponent={<VictoryTooltip style={{fontSize: '10px'}} cornerRadius={1} flyoutStyle={{ stroke: "transparent", strokeWidth: 1 }} pointerWidth={0}/>}
                    // animate={{
                    //     onExit: {
                    //       duration: 500,
                    //       before: () => ({ opacity: 0.3, _y: 0 })
                    //     },
                    //     duration: 1000,
                    //     onLoad: { duration: 1000 },
                    //     onEnter: {
                    //       duration: 500,
                    //       before: () => ({ opacity: 0.3, _y: 0 }),
                    //       after: (datum) => ({ opacity: 1, _y: datum._y })
                    //     }
                    //   }}
                    />
                )
                ct = ct + 1
        })
        return (
            <div id="wrapper">
                <Grid container>
                    {/* <Grid container xs={2}>
                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Typography>Counties</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {checkBoxes}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid> */}

                    <Grid id="chart" item xs={10} >
                        <Grid item xs={12} className="interpolating-methods">
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={selected}
                                onChange={this.handleSelect.bind(this)}
                                autoWidth
                                style={{fontSize: '15px'}}
                                >
                                <MenuItem value="basis" style={{fontSize: '15px'}}>basis</MenuItem>
                                <MenuItem value="bundle" style={{fontSize: '15px'}}>bundle</MenuItem>
                                <MenuItem value="cardinal" style={{fontSize: '15px'}}>cardinal</MenuItem>
                                <MenuItem value="catmullRom" style={{fontSize: '15px'}}>catmullRom</MenuItem>
                                <MenuItem value="linear" style={{fontSize: '15px'}}>linear</MenuItem>
                                <MenuItem value="monotoneX" style={{fontSize: '15px'}}>monotoneX</MenuItem>
                                <MenuItem value="monotoneY" style={{fontSize: '15px'}}>monotoneY</MenuItem>
                                <MenuItem value="step" style={{fontSize: '15px'}}>step</MenuItem>
                                <MenuItem value="stepAfter" style={{fontSize: '15px'}}>stepAfter</MenuItem>
                                <MenuItem value="stepBefore" style={{fontSize: '15px'}}>stepBefore</MenuItem>
                                <MenuItem value="natural" style={{fontSize: '15px'}}>natural</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <VictoryChart
                            theme={VictoryTheme.material}
                            height={canvasHeight}
                            width={canvasWidth}
                            domain={{x:domain.x,y:domain.y}}
                            >
                                <VictoryAxis tickValues={AxisTick} style={{tickLabels :{fontSize: 5}}}/>
                                <VictoryAxis style={{tickLabels :{fontSize: 5}}} dependentAxis/>

                                {lines}
                                {scatters}
                                <VictoryLegend
                                    x={50}
                                    y={20}
                                    title=""
                                    centerTitle={true}
                                    orientation="horizontal"
                                    style={{ labels:{fontSize:5}, border: { stroke: "white" }, title: {fontSize: 5 } }}
                                    data={legendData}
                                />
                            </VictoryChart>
                        </Grid>
                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default ReactCircleCard;