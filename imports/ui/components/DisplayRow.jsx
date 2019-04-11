/** Display 2, 3, 4, or 6 DisplayItems in a row, setting their grid properties such that they
  * take up an entire row on a medium screen, but display one per grid row on a small screen.
  **/
import React from 'react';

class DisplayRow extends React.Component {
  render() {
    const { children, childProps } = this.props;

    // const overflowClass = classNames({ [classes.allowOverflow]: this.state.in });
    const visibleChildren = children.filter(({ props }) => props.show).length;
    return React.Children.map(children, item =>
      React.cloneElement(item, {
        xs: 12,
        sm: 12 / (visibleChildren || 1),
        ...childProps
      })
    )
  }
};

export default DisplayRow;
