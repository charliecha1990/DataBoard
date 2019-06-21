import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import PageBase from '../components/PageBase';
import EnhancedTable from '../components/Profile/EnhancedTable';




const styles = _theme => ({
})

class BoardPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ] 
    }
  }

  render() {
    const { dataSet, loading, classes, match, ...props } = this.props;
    // const {  } = this.state;
    
    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
      >
        <EnhancedTable
        data={dataSet} /*Pass data from the container to enhanced table as props */
        />
      </PageBase>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(BoardPage);
