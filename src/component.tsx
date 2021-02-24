/**
 * Developed by Yiwen Zhou
 */
import * as React from "react";


import {CompanyData} from './tableDataParser';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './table.css';
import {
    VictoryLine
} from "victory";
import LinearDeterminate from './LoadingLine';

export interface State {
    companyMap: Map<string,CompanyData>,
    dateMap: Map<string,string>,
    cols: Array<string>,
    rows: Array<string>,
    testRows: Array<Map<string,string>>,
    maxLength: number,
    loading: boolean,
    progress: number
}

export const initialState: State = {
    companyMap : new Map<string,CompanyData>(),
    dateMap: new Map<string,string>(),
    cols: [],
    rows: [],
    testRows: [],
    maxLength: 0,
    loading: true,
    progress: 0
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
    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }
    render(){
        const {rows,cols,testRows,maxLength, loading, progress} = this.state
        if(loading){
            return <LinearDeterminate progress={progress}></LinearDeterminate>
        }
        var tableCells = []
        
        for(let i=0;i<testRows.length;i++){
            var cells = []
            cells.push(<TableCell size="small" style={{borderRight: '1px solid #118dff'}}>{rows[i]}</TableCell>)
            var cellValues = []
            testRows[i].forEach((value,key) => {
                cells.push(<TableCell size="small" align="center">{value ? value : " "}</TableCell>)
                cellValues.push(parseFloat(value.replace('%','')))
                if(cells.length == 4){
                    console.log('cellValue',cellValues)
                    cells.push(
                        <TableCell style={{ width: '80px', height:'20px', borderBottom: 'none!important'}} >
                            <VictoryLine
                                style={{
                                data: { stroke: "#118dff",strokeWidth: 10 },
                                }}
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                domain={{x: [1, 11]}}
                                data={[
                                { x: 1, y: cellValues[0]},
                                { x: 5, y: cellValues[1] },
                                { x: 10, y: cellValues[2] },
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
                    { x: 5, y: cellValues[4] },
                    ]
            }else{
                var data = [
                { x: 1, y: cellValues[3]},
                { x: 5, y: cellValues[4] },
                { x: 10, y: cellValues[5] },
                ]
            }
            cells.push(<TableCell style={{width: '80px',height:'20px', borderBottom: 'none!important'}} >
                            <VictoryLine
                                style={{
                                data: { stroke: "#118dff",strokeWidth: 10 },
                                }}
                                domain={{x: [1, 11]}}
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
            if(i == 0){
                cells.push(<TableCell size="small" align="left" style={{borderBottom: '1px solid #118dff'}}>{cols[i]}</TableCell>)
            }else{
                if(i == 4){
                    cells.push(<TableCell  align="center" style={{width: '200px!important', borderBottom: '1px solid #118dff'}}>{cols[i]}</TableCell>)
                }else{
                    cells.push(<TableCell size="small" align="center" style={{ borderBottom: '1px solid #118dff'}}>{cols[i]}</TableCell>)
                }
            }
        }
        const tableHead = <TableRow>
            {cells}
        </TableRow>
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