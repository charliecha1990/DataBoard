import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class URLList extends React.Component {
  state = {
    checked: [1],
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { onDeleteURL, queries, isLoading } = this.props;

    return (
      <List>
        {queries.map((URL, index) => (
          <ListItem key={index} dense button>
            <ListItemText secondary={`URL ${index + 1}: ${URL.substring(0, 35)}...`} />
            <ListItemSecondaryAction>
              <IconButton disabled={isLoading} aria-label="Delete">
                <DeleteIcon
                  fontSize="small"
                  onClick={() => onDeleteURL(index)} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default URLList