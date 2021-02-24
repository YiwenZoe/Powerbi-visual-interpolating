import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    paddingTop: '25%',
    width: '100%',
  },
});
interface Props{
    progress: number
}
export default function LinearDeterminate(prop:Props) {
  const classes = useStyles();
  const {progress} = prop


  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
}