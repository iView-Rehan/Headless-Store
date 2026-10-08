import { InfoPage } from '@app/components/Layout/InfoPage';

export default function ShippingAndReturns() {
  return (
    <InfoPage
      title="Shipping & returns"
      intro="What to expect once you have placed an order."
      sections={[
        {
          title: 'Shipping',
          body: [
            'Orders are packed at the studio and dispatched within two working days. Delivery is free on orders over $75.',
            'We use recyclable packaging wherever possible. Fragile items are wrapped by hand.',
          ],
        },
        {
          title: 'Returns and exchanges',
          body: [
            'You have thirty days from delivery to return an item. It should be unused and in its original packaging.',
            'Once we receive it, refunds go back to your original payment method within five working days. Exchanges are shipped at no extra cost.',
          ],
        },
      ]}
    />
  );
}
