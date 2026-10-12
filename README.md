# Headless Store

A headless storefront built with Next.js (App Router) and Wix Headless. It sells products, takes event bookings and lets customers design their own T-shirt, with Wix handling the catalog, events, media, cart, checkout and member login.

## Features

- Home page with hero, product slider, category tiles and an upcoming events slider
- Shop page with product grid and quick buy
- Product detail page with image gallery, options and variants, add to cart, buy now, back-in-stock notification
- Event detail page with ticket selection, schedule and share links
- Cart sidebar and redirect to Wix-hosted checkout
- Member login and logout
- Design studio (`/studio`): upload artwork, place it on a live T-shirt preview, order it with the print file attached
- Static pages: FAQ, Terms & conditions, Shipping & returns

## Tech stack

- Next.js (App Router), React, TypeScript
- Wix SDK: `@wix/sdk`, `@wix/stores` (products V3), `@wix/events`, `@wix/ecom`, `@wix/ricos`
- Tailwind CSS, Flowbite React

## Requirements

- Node.js 18 or 20
- A Wix site with Stores and Events installed
- A Wix Headless OAuth app and its client ID

## Setup

```bash
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_WIX_CLIENT_ID=your-wix-client-id
WIX_API_KEY=your-wix-api-key
WIX_SITE_ID=your-wix-site-id
NEXT_PUBLIC_CUSTOM_PRODUCT_SLUG=custom-tee
```

`WIX_API_KEY` and `WIX_SITE_ID` are server-only and used by the design upload route. The slug variable is optional and defaults to `custom-tee`.

Without this variable the site shows a "Page not available" message.

In the Wix dashboard, open your headless OAuth app and add your local and deployed URLs to the allowed domains and redirect domains (for example `http://localhost:3000` and your Vercel URL). Login and checkout redirects fail without this.

## Scripts

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build (runs lint)
npm run start   # run the production build
```

## Custom tee studio

Customers upload an image at `/studio`, drag and scale it on a T-shirt preview, choose colour and size, and add it to the cart. The design is stored in the Wix Media Manager and attached to the order line as free-text fields.

Wix setup:

1. Create a Wix Stores product with the slug `custom-tee` (or set `NEXT_PUBLIC_CUSTOM_PRODUCT_SLUG`).
2. Add a swatch option named `Color` (with colour codes) and a text option named `Size`, then create the variants.
3. Add three free-text modifiers with a max length of at least 200 characters: `Design file`, `Design preview`, `Placement`.
4. Create an API key (Wix account settings, API keys) with the Media Manager permission, and copy the site ID.
5. Add `WIX_API_KEY` and `WIX_SITE_ID` to `.env.local` and to Vercel.

In the Wix dashboard, each order line shows the three fields. `Design file` is the transparent print-ready PNG. `Design preview` is the mockup image shown in the cart.

How it works:

1. `components/Studio/Studio.tsx` renders the live preview and exports the design on the client.
2. `app/api/upload-design/route.ts` validates the image and uploads it to the Media Manager.
3. The cart line is added with `customTextFields` holding the file URLs.

Files are limited to 4 MB per upload because of Vercel request limits.

## Project structure

```
app/
  page.tsx                  Home (fetches products, categories, events)
  shop/                     Product list
  product-page/[slug]/      Product detail
  events/[slug]/            Event detail and tickets
  schedule/[slug]/          Full event schedule
  cart/                     Cart page
  faq/ terms/ shipping/     Info pages
  studio/                   Design studio page
  api/                      quick-buy, redirect-to-checkout, upload-design routes
  components/
    HomeScreen/             Home layout
    Slider/                 Horizontal slider with prev/next
    Shop/                   Shop grid and ProductCard
    Events/                 Events slider
    Product/                Sidebar, options, swatches, tags
    Layout/                 Header, nav drawer, footer, logo, page headers
    Studio/                 Design studio editor
    Tee/                    T-shirt mockup and hero preview
    Cart/ CartItem/ CartBag/ Cart UI
  hooks/                    Wix client and cart hooks
  utils/                    Formatters and test IDs
  constants.ts              Brand details and app constants
  globals.css               Theme tokens and shared component styles
```

## Customising

- **Brand name, tagline, contact details:** edit `BRAND` in `app/constants.ts`.
- **Colours:** edit the CSS variables at the top of `app/globals.css`. Components also use the same hex values directly (`#2e4a40` pine, `#f5f6f1` paper, `#e9a23b` accent).
- **Fonts:** Bricolage Grotesque and DM Sans, loaded by the `<link>` tags in `app/layout.tsx`.
- **Page copy:** FAQ, Terms and Shipping text lives in their `page.tsx` files and in `components/ShippingAndReturns`.
- **Products, events and categories:** managed in the Wix dashboard, not in code.

## Data flow

1. Server pages call the Wix client (`app/hooks/useWixClientServer.ts`) to fetch products and events.
2. Cards link to `/product-page/[slug]` and `/events/[slug]`, which fetch the full item on the server.
3. Client components (`ProductSidebar`, `Events`, cart) handle selection state and cart actions through `useWixClient`.
4. Checkout creates a redirect session and sends the customer to Wix-hosted checkout, then back to `/stores-success` or `/events-success`.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it on Vercel (framework is detected as Next.js).
3. Add `NEXT_PUBLIC_WIX_CLIENT_ID` under Environment Variables.
4. Deploy, then add the Vercel URL to the allowed domains in your Wix OAuth app.

Every push to `main` redeploys automatically.

## Troubleshooting

- **Images do not load:** add `static.wixstatic.com` to `images.remotePatterns` in `next.config.js`.
- **Build fails on formatting:** run `npx prettier --write "app/**/*.{ts,tsx,css}"`.
- **Login or checkout redirect fails:** the current domain is missing from the Wix OAuth app settings.
- **Product description shows raw tags:** descriptions are HTML and are rendered with `dangerouslySetInnerHTML` in `ProductSidebar.tsx`.
