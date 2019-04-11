import React from 'react';

import SadFace from '@material-ui/icons/SentimentVeryDissatisfied';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div
        className="snap"
        onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
            <SadFace />
            <p>We're sorry — something's gone wrong.</p>
            <p>Our team has been notified, but click here fill out a report.</p>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
