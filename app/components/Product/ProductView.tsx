import { ProductSidebar } from './ProductSidebar/ProductSidebar';
import { ImageGalleryClient } from '@app/components/ImageGallery/ImageGallery.client';
import testIds from '@app/utils/test-ids';
import { productsV3 } from '@wix/stores';

export function ProductView({ product }: { product: productsV3.V3Product }) {
  return (
    <div className="container-x pt-8 sm:pt-14">
      {product ? (
        <div
          className="full-w max-w-6xl mx-auto"
          data-testid={testIds.PRODUCT_DETAILS.CONTAINER}
        >
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14">
            <div className="box-border flex flex-col basis-1/2">
              <div>
                <ImageGalleryClient
                  items={product.media?.itemsInfo?.items ?? []}
                />
              </div>
            </div>
            <div className="flex flex-col w-full h-full basis-1/2 text-left">
              <ProductSidebar key={product._id} product={product} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border max-w-4xl mx-auto">
          Product Not Found
        </div>
      )}
    </div>
  );
}
