import './footer.css';
import ScrollIntoView from '@app/components/ScrollIntoView/ScrollIntoView';
import testIds from '@app/utils/test-ids';
import { BRAND } from '@app/constants';
import { Logo } from './Logo';

const col = 'flex flex-col gap-2.5 text-sm';
const head = 'font-default text-base font-semibold mb-1';

const Footer = () => (
  <footer
    className="w-full bg-[#1f342c] text-[#f5f6f1] mt-20 sm:mt-28"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <ScrollIntoView hashName="#contact" />
    <div className="container-x pt-14 pb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
      <div className="max-w-xs">
        <Logo />
        <p className="mt-4 text-sm opacity-75 leading-relaxed">
          Everyday goods, hosted evenings and custom tees printed to order.
        </p>
      </div>
      <div className={col}>
        <span className={head}>Shop</span>
        <a href="/shop" className="opacity-75 hover:opacity-100">
          All products
        </a>
        <a href="/studio" className="opacity-75 hover:opacity-100">
          Design a tee
        </a>
        <a href="/#events" className="opacity-75 hover:opacity-100">
          Upcoming events
        </a>
        <a href="/cart" className="opacity-75 hover:opacity-100">
          Your cart
        </a>
      </div>
      <div className={col}>
        <span className={head}>Help</span>
        <a href="/shipping" className="opacity-75 hover:opacity-100">
          Shipping & returns
        </a>
        <a href="/faq" className="opacity-75 hover:opacity-100">
          FAQ
        </a>
        <a href="/terms" className="opacity-75 hover:opacity-100">
          Terms & conditions
        </a>
      </div>
      <div className={col}>
        <span className={head}>Bookings and orders</span>
        <a
          href={`mailto:${BRAND.email}`}
          className="opacity-75 hover:opacity-100"
        >
          {BRAND.email}
        </a>
        <span className="opacity-75">{BRAND.phone}</span>
        <span className="opacity-75">{BRAND.address}</span>
      </div>
    </div>
    <div className="container-x border-t border-white/15 py-6 text-xs opacity-60">
      © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
    </div>
  </footer>
);

export default Footer;
