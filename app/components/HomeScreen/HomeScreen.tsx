import { wixEventsV2 as wixEvents } from '@wix/events';
import { productsV3 } from '@wix/stores';
import { Events } from '@app/components/Events/Events';
import testIds from '@app/utils/test-ids';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
import { Slider } from '@app/components/Slider/Slider';
import { ProductCard } from '@app/components/Shop/ProductCard';
import { BRAND } from '@app/constants';
import { HeroTee } from '@app/components/Tee/HeroTee';

const perks = [
  { title: 'Free delivery', text: 'On every order over $75' },
  { title: 'Thirty-day returns', text: 'Changed your mind? Send it back' },
  { title: 'Printed to order', text: 'Custom tees ship in 3 to 5 days' },
];

export function HomeScreen({
  events,
  productsForCategories,
  products = [],
}: {
  events: wixEvents.Event[];
  productsForCategories: {
    category: string;
    product: productsV3.V3Product;
  }[];
  products?: productsV3.V3Product[];
}) {
  const sliderProducts = products.length
    ? products
    : productsForCategories.map((p) => p.product).filter(Boolean);
  const categories = productsForCategories.filter(
    (c) => c?.product?.media?.main?.image
  );

  return (
    <div className="mx-auto relative">
      <section
        className="container-x grid gap-10 lg:grid-cols-[1.05fr_1fr] items-center pt-10 pb-14 sm:pt-16 sm:pb-20"
        data-testid={testIds.HOME_PAGE.HEADER}
      >
        <div>
          <h1 className="text-5xl sm:text-7xl lg:text-[84px]">
            Everyday goods. Tees made your way.
          </h1>
          <p className="mt-6 max-w-md text-lg opacity-80">
            Shop small-batch homewares, or upload your own artwork and have it
            printed on a tee. Book a hosted evening while you are at it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/studio" className="btn-main">
              Design your tee
            </a>
            <a href="/shop" className="btn-line">
              Shop the collection
            </a>
          </div>
        </div>
        <HeroTee />
      </section>

      <section className="border-y border-[color:var(--line)]">
        <ul className="container-x grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[color:var(--line)]">
          {perks.map((perk) => (
            <li key={perk.title} className="py-5 sm:px-6 first:sm:pl-0">
              <span className="font-default font-semibold block">
                {perk.title}
              </span>
              <span className="text-sm opacity-70">{perk.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] items-start">
          <div>
            <h2 className="section-title">
              Your art, on a tee, in three steps
            </h2>
            <a href="/studio" className="btn-main mt-6">
              Open the studio
            </a>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              [
                '01',
                'Upload',
                'Drop in a PNG, JPG or WebP. Transparent PNGs print best.',
              ],
              [
                '02',
                'Place',
                'Drag, resize and rotate it on the shirt. Pick a colour and size.',
              ],
              [
                '03',
                'Order',
                'We print the exact file you placed, then ship it.',
              ],
            ].map(([n, title, text]) => (
              <li key={n} className="border-t border-[color:var(--line)] pt-4">
                <span className="text-sm opacity-60">{n}</span>
                <h3 className="font-default text-xl font-semibold mt-1">
                  {title}
                </h3>
                <p className="mt-2 text-sm opacity-75">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {sliderProducts.length ? (
        <section className="container-x pt-16 sm:pt-24">
          <Slider
            label="product"
            header={
              <>
                <h2 className="section-title">New in the shop</h2>
                <a
                  href="/shop"
                  className="inline-block mt-3 text-sm font-medium underline underline-offset-4"
                >
                  View all products
                </a>
              </>
            }
          >
            {sliderProducts.map((item) => (
              <li
                key={item._id}
                className="w-[68%] sm:w-[260px] lg:w-[calc(25%-15px)] shrink-0 snap-start"
              >
                <ProductCard item={item} />
              </li>
            ))}
          </Slider>
        </section>
      ) : null}

      {categories.length ? (
        <section className="container-x pt-16 sm:pt-24">
          <h2 className="section-title mb-8 sm:mb-10">Shop by category</h2>
          <ul className="grid gap-5 sm:grid-cols-3">
            {categories.map(({ category, product }) => (
              <li key={category}>
                <a href="/shop" className="block group">
                  <div className="overflow-hidden rounded-[10px] bg-[#e3e7de]">
                    <WixMediaImage
                      media={product.media!.main!.image!}
                      width={720}
                      height={720}
                      alt={product.media!.main!.altText ?? category}
                    />
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <span className="font-default text-xl font-semibold">
                      {category}
                    </span>
                    <span className="text-sm opacity-70">Browse</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="text-xl sm:text-2xl w-full text-center p-9 max-w-3xl mx-auto mt-10">
          No categories found. Click{' '}
          <a
            href="https://manage.wix.com/account/site-selector?actionUrl=+https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fstore%2Fcategories%2Flist%3FreferralInfo%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="underline text-[color:var(--pine)]"
          >
            here
          </a>{' '}
          to go to the business dashboard to create store categories. Once
          added, they will appear here.
        </div>
      )}

      <section
        id="events"
        className="mt-16 sm:mt-24 py-16 sm:py-24 bg-[#2e4a40] text-[#f5f6f1] scroll-mt-[68px]"
      >
        {events?.length ? (
          <Events events={events} />
        ) : (
          <div className="text-xl sm:text-2xl w-full text-center p-9 max-w-3xl mx-auto">
            No events found. Click{' '}
            <a
              href="https://manage.wix.com/account/site-selector?actionUrl=https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fevents%3FreferralInfo%3DHeadless"
              target="_blank"
              rel="noreferrer"
              className="underline text-[color:var(--sun)]"
            >
              here
            </a>{' '}
            to go to the business dashboard to add events. Once added, they will
            appear here.
          </div>
        )}
      </section>

      <section className="container-x pt-16 sm:pt-24">
        <div className="rounded-[14px] bg-[#e3e7de] px-6 py-12 sm:px-14 sm:py-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-lg">
            <h2 className="section-title">Planning a private evening?</h2>
            <p className="mt-4 opacity-75">
              We host birthdays, team days and supper clubs at the studio. Tell
              us the date and group size and we will take it from there.
            </p>
          </div>
          <a
            href={`mailto:${BRAND.email}`}
            className="btn-main self-start sm:self-auto"
          >
            Email the studio
          </a>
        </div>
      </section>
    </div>
  );
}
