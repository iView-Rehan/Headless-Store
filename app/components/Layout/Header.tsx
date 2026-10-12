import { CartBag } from '@app/components/CartBag/CartBag';
import { NavBar } from './NavBar/NavBar';
import { Login } from '@app/components/Login/Login';
import { Logo } from './Logo';
import testIds from '@app/utils/test-ids';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/studio', label: 'Design a tee' },
  { href: '/#events', label: 'Events' },
  { href: '/faq', label: 'FAQ' },
];

const Header = () => (
  <header
    className="h-header z-40 w-full sticky top-0 bg-site border-b border-[color:var(--line)]"
    data-testid={testIds.LAYOUT.HEADER}
  >
    <div className="container-x flex h-header items-center gap-5 sm:gap-8">
      <a href="/" aria-label="Home" className="text-[color:var(--pine)]">
        <Logo />
      </a>
      <nav className="hidden md:flex flex-1 items-center gap-8 ml-6 text-sm font-medium">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="hover:opacity-60">
            {l.label}
          </a>
        ))}
      </nav>
      <div className="flex-1 md:hidden" />
      <div className="text-sm font-medium">
        <Login />
      </div>
      <div>
        <CartBag />
      </div>
      <div className="md:hidden">
        <NavBar />
      </div>
    </div>
  </header>
);

export default Header;
