import { productsV3 } from '@wix/stores';
import testIds from '@app/utils/test-ids';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';

export function ProductCard({
  item,
  quickBuy = false,
}: {
  item: productsV3.V3Product;
  quickBuy?: boolean;
}) {
  const inStock =
    (item.options?.length ?? 0) === 0 &&
    item.inventory?.availabilityStatus !== 'OUT_OF_STOCK';
  const customizable = ((item as any).modifiers?.length ?? 0) > 0;
  return (
    <div className="flex flex-col h-full">
      <a
        href={`/product-page/${item.slug}`}
        {...(quickBuy
          ? { 'data-testid': testIds.PRODUCT_ITEM.PRODUCT_DETAILS_CTA }
          : {})}
        className="block group"
      >
        <div className="overflow-hidden rounded-[10px] bg-[#e3e7de]">
          <WixMediaImage
            media={item.media?.main?.image}
            height={700}
            width={560}
            alt={item.media?.main?.altText || item.name || 'Product image'}
          />
        </div>
        <div className="pt-4 flex items-baseline justify-between gap-3">
          <span className="font-default text-base font-semibold leading-snug">
            {item.name}
          </span>
          <span className="text-sm shrink-0">
            {item.actualPriceRange?.minValue?.formattedAmount ?? ''}
          </span>
        </div>
      </a>
      {quickBuy && !customizable ? (
        <div className="mt-3">
          {inStock ? (
            <a
              data-testid={testIds.PRODUCT_ITEM.BUY_NOW_CTA}
              className="btn-line !py-2 !px-4 !text-xs"
              href={`/api/quick-buy/${item._id}?quantity=1`}
            >
              Buy now
            </a>
          ) : item.inventory?.availabilityStatus === 'OUT_OF_STOCK' ? (
            <button className="btn-main !py-2 !px-4 !text-xs" disabled>
              Out of stock
            </button>
          ) : (
            <a
              className="btn-line !py-2 !px-4 !text-xs"
              href={`/product-page/${item.slug}`}
            >
              Choose options
            </a>
          )}
        </div>
      ) : null}
      {quickBuy && customizable ? (
        <div className="mt-3">
          <a
            className="btn-main !py-2 !px-4 !text-xs"
            href={`/product-page/${item.slug}`}
          >
            Customize
          </a>
        </div>
      ) : null}
    </div>
  );
}
