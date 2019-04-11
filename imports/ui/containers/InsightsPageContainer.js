import { compose } from 'recompose';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import withQueryParams from '/imports/ui/helpers/withQueryParams';
import _ from 'lodash';

import { withMessageContext } from '/imports/ui/helpers/MessageContext';

import Query from '/imports/api/queries/Query';
// import Result from '/imports/api/results/Result';
import Brand from '/imports/api/brands/Brand';
import Board from '/imports/api/boards/Board';

import InsightsPage from '/imports/ui/pages/InsightsPage';

export default compose(
  withRouter,
  withQueryParams({ refineBrand: 'refineBrand' }),
  withTracker(props => {
    const query = Query.findOne(props.query._id);
    if (_.isUndefined(query)) { return { loading: true } }

    const resultsHandle = Meteor.subscribe('query.results', query._id);
    const mainResult = query.lastResult().fetch()[0];

    const { refineBrand } = props;
    if (mainResult && refineBrand) {
      Meteor.subscribe('result.refineBrand', mainResult._id, refineBrand);
    }

    const brandResult = mainResult && mainResult.refineBrand(refineBrand);

    Meteor.subscribe('brands');
    const brandLogos = Brand.find().fetch();

    const boardsHandle = Meteor.subscribe('boards');

    return {
      loading: !resultsHandle.ready(),
      result: refineBrand ? brandResult : mainResult,
      mainResult: refineBrand && mainResult,
      boardsLoading: !boardsHandle.ready(),
      boards: Board.find({ userId: Meteor.userId() }).fetch(),
      brandLogos
    };
  }),
  withMessageContext
)(InsightsPage);
