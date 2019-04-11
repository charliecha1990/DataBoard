import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';

import ProductDetail from './ProductDetail';
import CloseButton from '/imports/ui/components/CloseButton';

const styles = theme => ({
  root: {
    width: '100% !important',
    height: '100% !important',
  },
});

class ProductModal extends React.Component {
  handleClose = () => {
    this.props.handleClose();
  }

  render() {
    const { product, open, classes } = this.props;
    if (_.isEmpty(product)) { return null; }

    return (
      <Modal
        aria-labelledby="modal-title"
        open={open}
        onClose={this.handleClose}
        classes={{ root: classes.root }}
      >
        <ProductDetail product={product}>
          <CloseButton onClick={this.handleClose} />
        </ProductDetail>
      </Modal>
    );
  }
}

export default withStyles(styles)(ProductModal);
