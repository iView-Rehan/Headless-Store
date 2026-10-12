import { getWixClient } from '@app/hooks/useWixClientServer';
import { Studio } from '@app/components/Studio/Studio';
import { CUSTOM_PRODUCT_SLUG } from '@app/constants';

export default async function StudioPage() {
  const wixClient = await getWixClient();
  let product = null;
  try {
    const res = await wixClient.productsV3.getProductBySlug(
      CUSTOM_PRODUCT_SLUG,
      {
        fields: ['CURRENCY', 'MEDIA_ITEMS_INFO', 'VARIANT_OPTION_CHOICE_NAMES'],
      }
    );
    product = res.product ?? null;
  } catch (e) {
    console.error('Studio product not found:', CUSTOM_PRODUCT_SLUG);
  }
  return <Studio product={product} slug={CUSTOM_PRODUCT_SLUG} />;
}
