import React from 'react';
import _ from 'lodash';

import FloatingActionButton from './FloatingActionButton';
import Zoom from '@material-ui/core/Zoom';

class PageActionButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: this.props.icon,
      lastIconType: this.iconType(),
      in: false,
    };
  }

  componentDidMount() {
    this.maybeAppear();
  }

  componentDidUpdate(_prevProps, _prevState) {
    const iconType = this.iconType();
    if (iconType !== this.state.lastIconType) {
      this.setState({
        in: false,
        lastIconType: iconType
      });
    }
  }

  iconType = () => _.get(this.props.icon, 'type.displayName')

  maybeAppear = () =>
    this.setState({
      in: this.shouldShow(),
      icon: this.props.icon,
    });

  shouldShow = () => !!this.props.onClick && !!this.props.icon;

  render() {
    const { classes, ...props} = this.props;
    const { icon } = this.state;

    return (
      <Zoom appear in={this.state.in} onExited={this.maybeAppear}>
        <FloatingActionButton
            color="secondary"
            {...props}
        >
          { icon || false }
        </FloatingActionButton>
      </Zoom>
    );
  }
}

export default PageActionButton;
