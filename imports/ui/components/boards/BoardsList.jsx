import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { PRESENTERS } from './presenters';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  actionArea: {
    width: '100%',
  },
  boardPreview: {
    '&:hover': {
      cursor: 'pointer',
    }
  },
  boardGridContainer: {
    padding: theme.spacing.unit,
  },
})

const BoardsList = ({ boards, onSelect, classes }) => (
  <Grid container spacing={16}>
    { boards.map(board =>
      <Grid item key={board._id} xs={12} md={3} className={classes.boardPreview}>
        <Card>
          <CardActionArea className={classes.actionArea} onClick={onSelect.bind(this, board._id)}>
            <CardHeader title={board.name} />
            <CardContent>
              <Grid container className={classes.boardGridContainer}>
                {
                  board.items.slice(0, 9).map(item =>
                    <Grid item xs={3} key={item._id}>
                      { React.createElement(PRESENTERS[item.type], item.data) }
                    </Grid>
                  )
                }
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )}
  </Grid>
);

export default withStyles(styles)(BoardsList);
