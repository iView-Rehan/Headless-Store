import testIds from '@app/utils/test-ids';

interface ProductTagProps {
  name: string;
  price: string;
  sku?: string;
}

export const ProductTag: React.FC<ProductTagProps> = ({ name, price, sku }) => {
  return (
    <>
      {sku && <span className="text-xs opacity-60 mb-3 block">SKU: {sku}</span>}
      <h2
        data-testid={testIds.PRODUCT_DETAILS.HEADER}
        className="max-w-full w-full text-3xl sm:text-4xl leading-tight py-1"
      >
        {name}
      </h2>
      <p className="text-xl inline-block py-2 mb-2">{price}</p>
    </>
  );
};
