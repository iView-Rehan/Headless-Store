import { productsV3 } from '@wix/stores';
import testIds from '@app/utils/test-ids';
import { PageHeader } from '@app/components/Layout/PageHeader';
import { ProductCard } from './ProductCard';

export function Shop({ items }: { items: productsV3.V3Product[] }) {
  return (
    <div className="mx-auto">
      <PageHeader
        testId={testIds.SHOP_PAGE.HEADER}
        title="The shop"
        intro="Homewares made in small runs, chosen to be used every day and kept for years."
      />
      {items.length ? (
        <div
          className="container-x pt-12 sm:pt-16"
          data-testid={testIds.PRODUCT_LIST.CONTAINER}
        >
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {items.map((item) => (
              <li key={item._id} data-testid={testIds.PRODUCT_ITEM.CONTAINER}>
                <ProductCard item={item} quickBuy />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-xl sm:text-2xl w-full text-center p-9 max-w-3xl mx-auto">
          No products found. Click{' '}
          <a
            href="https://manage.wix.com/account/site-selector?actionUrl=+https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fstore%2Fproducts%3FreferralInfo%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="underline text-[color:var(--pine)]"
          >
            here
          </a>{' '}
          to go to the business dashboard to add products. Once added, they will
          appear here.
        </div>
      )}
    </div>
  );
}
