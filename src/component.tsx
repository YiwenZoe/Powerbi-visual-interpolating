/**
 * Developed by Yiwen Zhou
 */
import * as React from "react";

import GridDemo from './GridDemo';

export interface State {

}

export const initialState: State = {

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
        // const {rows,cols,testRows,maxLength, loading, progress} = this.state

    return (
            <div>
                <GridDemo />
            </div>
        )
    }
}

export default ReactCircleCard;