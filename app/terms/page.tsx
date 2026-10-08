import { InfoPage } from '@app/components/Layout/InfoPage';

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms & conditions"
      intro="The short version of how orders, bookings and your data are handled."
      sections={[
        {
          title: 'Customer care',
          body: [
            'Questions about an order or booking are answered within one working day. Write to us with your order number and we will take care of the rest.',
            'If something arrives damaged or is not as described, tell us within fourteen days and we will replace it or refund you.',
          ],
        },
        {
          title: 'Privacy and safety',
          body: [
            'We only collect the details needed to deliver your order or confirm your booking. Payments are processed by our payment partners, and we never see or store your card number.',
            'We do not sell your information. You can ask us to delete your account data at any time.',
          ],
        },
        {
          title: 'Events and bookings',
          body: [
            'Tickets are personal to the booking name unless transferred to another guest by email. Doors open fifteen minutes before the start time.',
            'If we have to cancel an event, you will be offered a new date or a full refund.',
          ],
        },
        {
          title: 'Wholesale inquiries',
          body: [
            'We supply a small number of independent shops. Email us with a link to your store and the products you are interested in.',
          ],
        },
        {
          title: 'Payment methods',
          body: [
            'Credit and debit cards, PayPal, and offline payments by arrangement.',
          ],
        },
      ]}
    />
  );
}
