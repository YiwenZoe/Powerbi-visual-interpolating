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
import Axios from 'axios';
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

const monthToIndexMap = new Map<string, number>([
    ['Dec 2019',1],
    ['Jan 2020',5],
    ['Feb 2020',10],
    ['Dec 2020',1],
    ['Jan 2021',5],
    ['Feb 2021',10]
])
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
        Axios.get('https://microsoft.sharepoint.com/teams/CoP/Shared%20Documents/General/CoP_stuff/COP%20EPA%20report%20FY21%20MasterWorkbook.xlsx?raw=true')
        .then((res) => {
            console.log('result is',res)
        }).catch((error) => {
            console.log('error is',error)
        })
        if(loading){
            return <LinearDeterminate progress={progress}></LinearDeterminate>
        }
        var tableCells = []
        
        for(let i=0;i<testRows.length;i++){
            var cells = []
            cells.push(<TableCell size="small" style={{borderRight: '1px solid #118dff'}}>{rows[i]}</TableCell>)
            var cellValues = []
            var keyValues = []
            // testRows[i].forEach((value,key) => {
            //     cells.push(<TableCell size="small" align="center">{value ? value : " "}</TableCell>)
            //     cellValues.push(parseFloat(value.replace('%','')))
            //     keyValues.push(key)
            //     if(cells.length == 4){
            //         console.log('cellValue',cellValues)
            //         cells.push(
            //             <TableCell style={{ width: '80px', height:'20px', borderBottom: 'none!important'}} >
            //                 <VictoryLine
            //                     style={{
            //                     data: { stroke: "#118dff",strokeWidth: 10 },
            //                     }}
            //                     animate={{
            //                         duration: 2000,
            //                         onLoad: { duration: 1000 }
            //                     }}
            //                     domain={{x: [1, 11]}}
            //                     data={[
            //                     { x: monthToIndexMap.get(keyValues[0]), y: cellValues[0]},
            //                     { x: monthToIndexMap.get(keyValues[1]), y: cellValues[1] },
            //                     { x: monthToIndexMap.get(keyValues[2]), y: cellValues[2] },
            //                     ]}
            //                 />
            //             </TableCell>
            //             )
            //     }
            // })
            monthToIndexMap.forEach((value,key) => {
                cells.push(<TableCell size="small" align="center">{testRows[i].get(key) ? testRows[i].get(key) : " "}</TableCell>)
                if(testRows[i].has(key)){
                    cellValues.push(parseFloat(testRows[i].get(key).replace('%','')))
                    keyValues.push(key)
                }
                
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
                                { x: monthToIndexMap.get(keyValues[0]), y: cellValues[0]},
                                { x: monthToIndexMap.get(keyValues[1]), y: cellValues[1] },
                                { x: monthToIndexMap.get(keyValues[2]), y: cellValues[2] },
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
                console.log('TestRows',keyValues)
                var data = [
                    { x: monthToIndexMap.get(keyValues[3]), y: cellValues[3]},
                    { x: monthToIndexMap.get(keyValues[4]), y: cellValues[4] },
                    ]
            }else{
                var data = [
                { x: monthToIndexMap.get(keyValues[3]), y: cellValues[3]},
                { x: monthToIndexMap.get(keyValues[4]), y: cellValues[4] },
                { x: monthToIndexMap.get(keyValues[5]), y: cellValues[5] },
                ]
            }
            cells.push(<TableCell style={{width: '80px',height:'20px', borderBottom: 'none!important'}} >
                            <VictoryLine
                                style={{
                                data: { stroke: "#9d9d9d",strokeWidth: 10 },
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