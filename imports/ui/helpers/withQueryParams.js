import { withProps, wrapDisplayName } from 'recompose';
import queryString from 'query-string';
import _ from 'lodash';

/* Wrap a component with the specified URL query params mapped to props */
/* The component *must* already be wrapped in withRouter, as withQueryParams
 * expects a location prop as provided by withRouter */
/* returns a withTracker function, which takes a component as its only argument */
/* takes an object of form { queryParamName: propName } */
/* e.g. withQueryParams({ query: 'queryId' })(MyPage) */
const withQueryParams = (paramsMap) => withProps((props) => {
  if (_.isUndefined(props.location)) {
    console.error("It looks like you're using withQueryParams without withRouter. This won't work.");
    return;
  }

  const params = queryString.parse(props.location.search);
  return Object.keys(paramsMap).reduce((memo, param) => (
    {
      ...memo,
      [paramsMap[param]]: _.get(params, param, '')
    }
  ), {
    setQueryParam: (param, value) => {
      if (!Object.keys(paramsMap).includes(param)) { return; }

      const currentSearch = queryString.parse(props.location.search);
      let newSearch = { ...currentSearch, [param]: value };
      if (value === null) { delete newSearch[param] };
      const search = queryString.stringify(newSearch);
      props.history.push({
        ...props.location,
        search
      });
    }
  })
});

export default withQueryParams;
