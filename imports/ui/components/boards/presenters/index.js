export * from './ImagePresenter';
export * from './ColorPresenter';
export * from './ProductPresenter';

import { ColorPresenter, ImagePresenter, ProductPresenter } from '/imports/ui/components/boards/presenters';

export const PRESENTERS = {
  image: ImagePresenter,
  color: ColorPresenter,
  product: ProductPresenter
}
