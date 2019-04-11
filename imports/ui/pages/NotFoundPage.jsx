import React from 'react';

import PageBase from '/imports/ui/components/PageBase';

import Typography from '@material-ui/core/Typography';

const NotFoundPage = () => {
  return (
    <PageBase>
      <Typography variant="title">
        We couldn't find that page :(
      </Typography>
    </PageBase>
  );
};

export default NotFoundPage;
