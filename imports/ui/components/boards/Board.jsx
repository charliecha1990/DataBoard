import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { withTracker } from 'meteor/react-meteor-data';
// import classNames from 'classnames';

import { linkWithParams } from '/imports/ui/helpers/routes';
import { Link } from 'react-router-dom';

import { COLUMNS } from '/imports/api/boards/Board';
import { PRESENTERS } from './presenters';

import Loading from '/imports/ui/components/Loading';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles';
import 'react-resizable/css/styles';

const GridLayout = WidthProvider(ReactGridLayout);

const styles = theme => ({
  gridLayout: {

  },
  itemActions: {
    display: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  actionButton: {
    padding: 0,
  },
  gridItem: {
    overflow: 'hidden',
    '& .react-resizable-handle': {
      display: 'none',
    },
    '&.resizing .react-resizable-handle': {
      display: 'inline',
    },
    '&:hover': {
      '& .react-resizable-handle': {
        display: 'inline'
      },

      '& $itemActions': {
        display: 'block'
      }
    },
  },
  actions: {
    minHeight: 56,
  },
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  deleteButton: {
    position: 'absolute',
    right: theme.spacing.unit,
  },
  hiddenInput: {
    display: 'none',
  },
  '@global': {
    '.react-grid-item.react-grid-placeholder': {
      backgroundColor: theme.palette.primary.main,
      backgroundOpacity: 0.8,
    },
  }
});

class Board extends React.PureComponent {
  // breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
  // cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}

  render() {
    const {
      board, handleLayoutChange, handleFileChange, handleRemoveItem,
      deleteBoard, addImages,
      toggleMenu, menu, menuAnchorEl, presentationMode, classes, loading
    } = this.props;
    if (loading) { return <Loading />; }

    const layout = board.layoutForReactGrid();
    const { items, name } = board;

    return (
      <Card>
        <CardHeader
          title={name}
          action={
            <IconButton onClick={toggleMenu}>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <Menu
          id="simple-menu"
          anchorEl={menuAnchorEl}
          open={Boolean(menu)}
          onClose={toggleMenu}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={deleteBoard}>
            <ListItemIcon className={classes.icon}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Delete Board" />
          </MenuItem>
        </Menu>
        <CardActions className={classes.actions}>
          { !presentationMode &&
            <React.Fragment>
              <input
                accept="image/*"
                className={classes.hiddenInput}
                id="contained-button-file"
                multiple
                type="file"
                onChange={e => addImages(e)}
              />
              <label htmlFor="contained-button-file">
                <Button component="span" color="primary">
                  <CloudUploadIcon className={classes.buttonIcon} />
                  Upload Image
                </Button>
              </label>
            </React.Fragment>
          }
        </CardActions>
        <CardContent>
          { _.isEmpty(items) ?
              <div>
                <Typography variant="subheading">
                  <Link to={linkWithParams('/insights')}>Search for some content</Link> to add to your board.
                </Typography>
              </div>
              :
              <GridLayout
                  className={classes.gridLayout}
                  layout={layout}
                  onLayoutChange={handleLayoutChange}
                  cols={COLUMNS}
                  rowHeight={30}
                  autoSize={true}
                  margin={[0, 0]}
                  isDraggable={!presentationMode}
                  isResizable={!presentationMode}
                  verticalCompact>
                { items.filter(item => Object.keys(PRESENTERS).includes(item.type))
                       .map(({ type, data, _id }) => {
                         const Presenter = PRESENTERS[type];
                         return (
                            <div key={_id} className={classes.gridItem}>
                              <Presenter {...data} />
                              <div className={classes.itemActions}>
                                <IconButton className={classes.actionButton} onClick={handleRemoveItem.bind(this, _id)} aria-label="Remove Item">
                                  <CloseIcon fontSize='small' />
                                </IconButton>
                              </div>
                            </div>
                          );
                        }
                      )
                }
              </GridLayout>
          }
        </CardContent>
      </Card>
  );
  }
}

export default withStyles(styles)(Board);
