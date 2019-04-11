import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import withQueryParams from '/imports/ui/helpers/withQueryParams';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LinkIcon from '@material-ui/icons/Link';

import ContainerDimensions from 'react-container-dimensions';
import FillImage from '/imports/ui/components/FillImage';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    overflow: 'hidden',
    '&:focus': {
      outline: 0,
    }
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  thumbnails: {
    maxWidth: theme.spacing.unit * 11 * 2 + theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'none',
      order: 3
    },
  },
  image: {
    height: '90%',
    [theme.breakpoints.down('sm')]: {
      order: 2,
      height: 'auto',
    },
  },
  metrics: {
    maxWidth: theme.spacing.unit * 32,
    [theme.breakpoints.down('sm')]: {
      order: 1
    },
  },
  thumbnailOuter: {
    padding: theme.spacing.unit,
    height: theme.spacing.unit * 11,
    width: theme.spacing.unit * 11,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  thumbnailInner: {
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10,
  },
  hovered: {
    border: '1px solid #eee'
  },
  selected: {
    border: '1px solid #ddd'
  },
});

class ProductDetail extends React.Component {
  state = {
    imageHover: null,
    imageSelect: 0,
  }

  handleImageHover = idx => this.setState({ imageHover: idx });
  handleImageSelect = idx => this.setState({ imageSelect: idx });

  render() {
    const { product, classes, children } = this.props;
    if (_.isEmpty(product)) { return null; }

    const { imageHover, imageSelect } = this.state;

    return (
      <Paper className={classes.paper} dataproductid={product._id}>
        { children }
        <Grid container className={classes.container} justify="center" alignItems="center" spacing={0}>
          { product.images_urls && product.images_urls.length > 1 ?
              <Grid item xs={12} md={4} className={classes.thumbnails}>
                <Grid container style={{ height: '100%' }}
                      alignContent="center" justify="center" alignItems="center">
                  { product.images_urls.map((u, idx) =>
                    <div key={u}
                       className={classes.thumbnailOuter}
                       onMouseOver={() => this.handleImageHover(idx)}
                       onMouseOut={() => this.handleImageHover(null)}
                       onClick={() => this.handleImageSelect(idx)}
                    >
                      <div
                        className={classNames(classes.thumbnailInner, {
                          [classes.hovered]: idx === imageHover,
                          [classes.selected]: idx === imageSelect,
                        })}>
                        <FillImage src={u} />
                      </div>
                    </div>
                  ) }
                </Grid>
              </Grid> : null
          }
          <Grid item xs={12} md={6} className={classes.image}>
            <FillImage src={product.images_urls[imageHover || imageSelect || 0]}
              imageStyle={{
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              disableSpinner
              disableTransition />
          </Grid>
          <Grid item xs={12} md={4} className={classes.metrics}>
            <Grid container justify="space-between">
              <Grid item xs={12}>
                <Typography id="modal-title"
                  align="center" variant="headline">
                  { product.brand }
                </Typography>
                <LinkIcon onClick={() => this.props.setQueryParam('productFocus', product._id._str)} />
              </Grid>

              { product.gender &&
                  <React.Fragment>
                    <Grid item xs={5}><Typography variant="subheading">Gender</Typography></Grid>
                    <Grid item xs={5}><Typography align="right">{ product.gender === 'men' ? 'Men' : 'Women' }</Typography></Grid>
                  </React.Fragment>
              }

              <Grid item xs={5}><Typography variant="subheading">{ product.avg_price_changes <= 0 ? 'Markdowns': 'Markups' }</Typography></Grid>
              <Grid item xs={5}><Typography align="right">{ Math.abs(product.avg_price_changes || 0).toFixed(1) }%</Typography></Grid>

              <Grid item xs={12}>
                <Typography variant="subheading">Categories</Typography>
              </Grid>
              { product.categories.map(category =>
                    <Grid key={category} item xs={12} style={{ padding: 0 }}><Typography align="right">{ category }</Typography></Grid>
              ) }

              <Grid item xs={12}>
                <Typography variant="title">Sellers</Typography>
              </Grid>
              { product.sellers.map(seller =>
                  <React.Fragment key={seller.name}>
                    <Grid item xs={5}><Typography variant="subheading">{ seller.name }</Typography></Grid>
                    <Grid item xs={5}><Typography align="right">${ seller.price.toFixed(2) }</Typography></Grid>
                  </React.Fragment>
              ) }
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter,
  withQueryParams({ productFocus: 'productFocus' }),
)(ProductDetail);
