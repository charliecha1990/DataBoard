import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddToPhotos';

import ContainerDimensions from 'react-container-dimensions';
import FillImage from '/imports/ui/components/FillImage';

import currency from 'currency.js';

const TILE_HEIGHT = 400;

const styles = theme => ({
  tile: {
    height: 400,
    '&:hover': {
      cursor: 'pointer',
      '& $titleBar': {
        opacity: 1.0,
        transition: 'opacity 0.1s ease-in',
      },
    }
  },
  titleBar: {
    background: 'rgba(0,0,0,0.8)',
    opacity: 0,
  },
  active: {
    opacity: 1.0,
  },
  title: {
    color: theme.palette.secondary.contrastText,
  },
  actionIcon: {
    color: theme.palette.secondary.contrastText,
  },
});

class ProductTile extends React.Component {
  handleActionClick = e => {
    e.stopPropagation();

    this.props.handleAddToBoard(this.props.product, this.actionButton);
  }

  setActionButtonRef = element => {
    this.actionButton = element;
  }

  handleSelect = e => {
    e.stopPropagation();
    this.props.handleSelect(this.props.product);
  }

  render() {
    const { product, focused, handleSelect, handleAddToBoard, cancelAddToBoard, classes, ...props } = this.props;
    const { _id, product_id, images_urls, brand } = product;
    const priceLow = product.priceLow();
    const priceHigh = product.priceHigh();
    const lowDisplay = currency(priceLow, { precision: 0 }).format(true);
    const highDisplay = currency(priceHigh, { precision: 0 }).format(true);
    const priceDisplay = priceLow == priceHigh ? lowDisplay : `${lowDisplay} - ${highDisplay}`;

    return (
      <GridListTile className={classes.tile}
                    onClick={this.handleSelect}
                    {...props}>
        <FillImage className={classes.image}
               src={images_urls[0]}
               alt={brand}
               dataid={_id}
               datasem3id={product_id.sem3_id} />

        <GridListTileBar
          classes={{
            root: classNames(classes.titleBar, { [classes.active]: focused }),
            title: classes.title,
          }}
          title={brand}
          titlePosition="top"
          actionPosition="right"
          actionIcon={
           <IconButton
              onClick={this.handleActionClick}
              className={classes.actionIcon}
              buttonRef={this.setActionButtonRef}>
             <AddIcon />
           </IconButton>
         }
        />
      </GridListTile>
    );
  }
}

export default withStyles(styles)(ProductTile);
