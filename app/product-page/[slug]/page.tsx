import { getWixClient } from '@app/hooks/useWixClientServer';
import { ProductView } from '@app/components/Product/ProductView';
import { Studio } from '@app/components/Studio/Studio';
import { isCustomizable } from '@app/utils/customizable';

export default async function StoresCategoryPage({ params }: any) {
  if (!params.slug) {
    return;
  }
  const wixClient = await getWixClient();
  const { product } = await wixClient.productsV3.getProductBySlug(
    decodeURIComponent(params.slug),
    {
      fields: [
        'PLAIN_DESCRIPTION',
        'CURRENCY',
        'MEDIA_ITEMS_INFO',
        'INFO_SECTION',
        'INFO_SECTION_PLAIN_DESCRIPTION',
        'VARIANT_OPTION_CHOICE_NAMES',
      ],
    }
  );

  if (product && isCustomizable(product)) {
    return (
      <>
        <Studio product={product} slug={product.slug!} embedded />
        {product.plainDescription ? (
          <div className="container-x pt-10">
            <div
              className="rich-html max-w-2xl opacity-90"
              dangerouslySetInnerHTML={{ __html: product.plainDescription }}
            />
          </div>
        ) : null}
      </>
    );
  }
  return <ProductView product={product!} />;
}

export async function generateStaticParams(): Promise<{ slug?: string }[]> {
  const wixClient = await getWixClient();
  return wixClient.productsV3
    .queryProducts()
    .limit(10)
    .find()
    .then(({ items }) => {
      return items.map((product) => ({
        slug: product.slug ?? undefined,
      }));
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
