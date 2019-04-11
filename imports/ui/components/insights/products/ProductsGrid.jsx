import React from 'react';
import _ from 'lodash';

import { withTracker } from 'meteor/react-meteor-data';
import withSession from '/imports/ui/helpers/withSession';
import { withStyles } from '@material-ui/core/styles';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import withQueryParams from '/imports/ui/helpers/withQueryParams';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withMessageContext } from '/imports/ui/helpers/MessageContext';

import Product from '/imports/api/products/Product';

import ProductTile from './ProductTile';
import ProductModal from './ProductModal';
import AddToBoard from './AddToBoard';

import GridList from '@material-ui/core/GridList';

const styles = _theme => ({
  container: {
    width: '100%',
    position: 'relative',
  },
});

class Products extends React.Component {
  state = {
    productHover: null,
    focusedProduct: null,
    focusAction: null,
  }

  componentDidMount() {
    this.handleProductFocus();
  }

  componentDidUpdate(prevProps, _prevState) {
    if (prevProps.productFocus !== this.props.productFocus) {
      this.handleProductFocus();
    }
  }

  handleProductFocus = () => {
    if (_.isEmpty(this.props.productFocus)) {
      this.resetFocusAction();
      return;
    }

    const focusedProduct = Product.findOne(new Mongo.ObjectID(this.props.productFocus));
    if (_.isEmpty(focusedProduct)) {
      this.props.pushMessage("We couldn't find that product, sorry.");
      this.props.setQueryParam('productFocus', null);
    }

    this.handleSelect(focusedProduct);
  }

  handleProductHover = (idx) => this.setState({ productHover: idx });

  resetProductHover = () => this.handleProductHover(null);

  handleChangePage = (event, page) => {
    this.props.setSession({ page });
  }

  handleChangeRowsPerPage = event => {
    this.props.setSession({ perPage: event.target.value });
  }

  resetFocusAction = () => this.setState({ focusedProduct: null, focusAction: null });

  handleSelect = focusedProduct => {
    this.setState({
      focusedProduct,
      focusAction: 'view',
    });
  }

  handleAddToBoard = (focusedProduct, buttonRef) => {
    if (_.get(focusedProduct, '_id') === _.get(this.state.focusedProduct, '_id') &&
          this.state.focusAction === 'addToBoard') {
      this.resetFocusAction();
      return;
    }

    this.setState({
      focusedProduct,
      focusAction: 'addToBoard',
      addToBoardRootEl: buttonRef,
    });
  }

  handleCloseModal = () => this.resetFocusAction();

  render() {
    const { products, _count, width, classes, session } = this.props;
    if (_.isEmpty(products)) { return null; }

    const { addToBoardRootEl, _productHover, focusedProduct, focusAction, _imageHover, _imageSelect } = this.state;

    const { perPage, page } = session;
    const _productCount = products.length;
    const displayProducts = products.slice(page * perPage, (page + 1) * perPage);

    return (
      <React.Fragment>
        <GridList className={classes.container} cols={isWidthUp('md', width) ? 4 : 2} onMouseOut={this.resetProductHover}>
          {displayProducts.map(product =>
            <ProductTile key={product._id}
              product={product}
              focused={_.get(focusedProduct, '_id') === product._id}
              cancelAddToBoard={this.resetFocusAction}
              handleSelect={this.handleSelect}
              handleAddToBoard={this.handleAddToBoard}
              />
          )}
        </GridList>
        <ProductModal
          open={focusAction == 'view'}
          handleClose={this.handleCloseModal}
          product={focusedProduct} />
        <AddToBoard
          open={focusAction == 'addToBoard'}
          handleClose={this.resetFocusAction}
          item={{
            type: 'product',
            key: _.get(focusedProduct, ['_id', '_str']),
            data: {
              productId: _.get(focusedProduct, ['_id', '_str']),
              coverImageSrc: _.get(focusedProduct, ['images_urls', 0])
            }
          }}
          anchorEl={addToBoardRootEl} />
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  withQueryParams({ productFocus: 'productFocus' }),
  withSession('productDisplayOptions', {
    page: 0,
    perPage: 6 * 12,
  }),
  withTracker(({ session, result }) => {
    if (_.isEmpty(result._id)) { return { products: [], loading: true }; }

    const productsHandle = Meteor.subscribe('result.products', result._id, session.page, session.perPage * 2);
    const products = result.products(session.page, session.perPage).fetch();
    return {
      products,
      loading: !productsHandle.ready(),
    }
  }),
  withWidth({resizeInterval: 40}),
  withStyles(styles),
  withMessageContext
)(Products);
