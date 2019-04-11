import { withTracker } from 'meteor/react-meteor-data';

/* Create a reactive prop based on Meteor session */
/* returns a withTracker function, which takes a component as its only argument */
/* e.g. withSession('MyPageOptions', { showThing: true })(MyPage) */
const withSession = (key, defaultOptions = {}) => withTracker(() => {
  Session.setDefault(key, defaultOptions);
  const sessionOptions = Session.get(key);

  return {
    session: sessionOptions,
    setSession: options => Session.set(key, Object.assign({}, sessionOptions, options)),
    resetSession: () => Session.set(key, defaultOptions),
  };
});

export default withSession;
