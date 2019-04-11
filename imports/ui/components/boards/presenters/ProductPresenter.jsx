import React from 'react';

import FillImage from '/imports/ui/components/FillImage';

export const ProductPresenter = ({ productId: _productId, coverImageSrc }) => <FillImage src={coverImageSrc} />;
