import { InfoPage } from '@app/components/Layout/InfoPage';

export default function FAQPage() {
  return (
    <InfoPage
      title="Frequently asked questions"
      intro="Quick answers about orders, delivery and booking events."
      sections={[
        {
          title: 'Do you deliver internationally?',
          body: [
            'Yes. We ship to most countries. Delivery costs and times are shown at checkout once you enter your address.',
          ],
        },
        {
          title: 'How do I track my order?',
          body: [
            'You will receive a tracking link by email as soon as your order leaves the studio. Orders usually ship within two working days.',
          ],
        },
        {
          title: 'How do I return an item?',
          body: [
            'Email us within thirty days of delivery with your order number. Unused items in their original packaging are refunded in full.',
          ],
        },
        {
          title: 'How do I book an event?',
          body: [
            'Open any event from the home page, choose your ticket and check out. Your confirmation and entry details arrive by email straight away.',
          ],
        },
        {
          title: 'Can I change or cancel my booking?',
          body: [
            'You can move or cancel a booking up to seven days before the event. After that, tickets can be passed on to a friend.',
          ],
        },
        {
          title: 'Which payment methods do you accept?',
          body: ['Major credit and debit cards, and PayPal.'],
        },
      ]}
    />
  );
}
