import * as React from "react";
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { TransitionProps } from '@material-ui/core/transitions';
import SvgIcon from '@material-ui/core/SvgIcon';

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
    },
  }),
)((props: TreeItemProps) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles(
  createStyles({
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: 400,
    },
  }),
);
interface CustomizedTreeViewProps {
  rows: Array<string>;
}
export default function CustomizedTreeView(props) {
  const classes = useStyles();
  const {rows} = props;
  const tableRow = <table style={{ width:'100%'}}>
                    <tr>
                        <td>Eve</td>
                        <td>Jackson</td>
                        <td>94</td>
                    </tr>
                  </table>
  const onNodeToggle = ((event,nodes) => {
    nodes.forEach(element => {
      console.log(element)
    });
  })
  const edges =[[1,2],[1,3],[1,4],[1,5],[3,6],[3,7],[7,9],[7,10],[7,11]];
  const graph = new Map<number,number[]>();
  const companyToIndex = new Map<string,number>();
  var ct = 1;
  rows.forEach(element => {
    if(!companyToIndex.has(element)){
      companyToIndex.set(element,ct);
      ct += 1;
    }
  });
  edges.forEach((value: number[],index: number) => {
    if(graph.has(value[0])){
      var values = graph.get(value[0]);
      
    }else{
      var values = new Array<number>();
    }
    values.push(value[1]);
    graph.set(value[0],values);
  })
  const buildTreeViewContent = (graph: Map<number,number[]>,node: number) => {
    var content = [];
    if(!graph.has(node)){
      return <StyledTreeItem nodeId={node.toString()} label={`Node${node}`} />
    }else{
      var values = graph.get(node);
      values.forEach((value: number) => {
        content.push(buildTreeViewContent(graph,value));
      })
    return <StyledTreeItem nodeId={node.toString()} label={`Node${node}`}>{content}</StyledTreeItem>
    }
  }
  const content = buildTreeViewContent(graph,1);
  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['1']}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      onNodeToggle={onNodeToggle}
      // defaultEndIcon={<CloseSquare />}
    >
      {content}
    </TreeView>
  );
}