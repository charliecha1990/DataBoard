import React from 'react';

const MessageContext = React.createContext([]);

export const withMessageContext = (Component) => {
  const wrapped = (props) =>
    <MessageContext.Consumer>
      {
        pushMessage => <Component {...props} pushMessage={pushMessage} />
      }
    </MessageContext.Consumer>
  wrapped.displayName = 'WithMessageContext';

  return wrapped;
}

export default MessageContext;
