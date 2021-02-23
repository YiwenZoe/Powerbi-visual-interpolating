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
import {CompanyData} from './tableDataParser';
import {DataGrid,ColDef} from '@material-ui/data-grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './table.css';
import {
    VictoryChart,VictoryTheme,VictoryLine,VictoryScatter,VictoryLabel,VictoryBar,VictoryTooltip,VictoryAxis,VictoryLegend,Flyout
} from "victory";

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
    companyMap: Map<string,CompanyData>,
    dateMap: Map<string,string>,
    cols: Array<string>,
    rows: Array<string>,
    testRows: Array<Map<string,string>>,
    maxLength: number,
}

export const initialState: State = {
    companyMap : new Map<string,CompanyData>(),
    dateMap: new Map<string,string>(),
    cols: [],
    rows: [],
    testRows: [],
    maxLength: 0,
}




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
    render(){
        const {rows,cols,testRows,maxLength} = this.state
        var tableCells = []
        for(let i=0;i<testRows.length;i++){
            var cells = []
            cells.push(<TableCell size="small" >{rows[i]}</TableCell>)
            var cellValues = []
            testRows[i].forEach((value,key) => {
                cells.push(<TableCell size="small" align="center">{value ? value : " "}</TableCell>)
                cellValues.push(parseFloat(value.replace('%','')))
                if(cells.length == 4){
                    console.log('cellValue',cellValues)
                    cells.push(
                        <TableCell style={{width: '45px',height:'10px'}} >
                            <VictoryLine
                                style={{
                                data: { stroke: "#c43a31",strokeWidth: 20 },
                                }}
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                domain={{x: [1, 3]}}
                                data={[
                                { x: 1, y: cellValues[0]},
                                { x: 2, y: cellValues[1] },
                                { x: 3, y: cellValues[2] },
                                ]}
                            />
                        </TableCell>
                        )
                }
                
            })
            while(cells.length< maxLength + 2){
                cells.push(<TableCell size="small" align="center"></TableCell>)
            }
            if(cellValues.length<6){
                var data = [
                    { x: 1, y: cellValues[3]},
                    { x: 2, y: cellValues[4] },
                    ]
            }else{
                var data = [
                { x: 1, y: cellValues[3]},
                { x: 2, y: cellValues[4] },
                { x: 3, y: cellValues[5] },
                ]
            }

            cells.push(<TableCell style={{width: '45px',height:'10px'}}>
                            <VictoryLine
                                style={{
                                data: { stroke: "#c43a31",strokeWidth: 20 },
                                }}
                                domain={{x: [1, 3]}}
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                data={data}
                            />
                    </TableCell>
                )
            tableCells.push(<TableRow key={rows[i]}>
            {cells}
            </TableRow>)
            
        }
        var cells = []
        for(let i=0;i<cols.length;i++){
            cells.push(<TableCell size="small" align="center">{cols[i]}</TableCell>)
        }

        const tableHead = <TableRow>
            {cells}
        </TableRow>




    console.log(testRows,rows,cols)
    return (
            <TableContainer>
                <Table size="small" aria-label="simple table" padding="none">
                <TableHead>
                    {tableHead}
                </TableHead>
                <TableBody>
                    {tableCells}
                </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default ReactCircleCard;