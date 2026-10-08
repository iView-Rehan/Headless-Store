'use client';
import { useUI } from '@app/components/Provider/context';
import { useCart } from '@app/hooks/useCart';
import { currentCartV2 } from '@wix/ecom';

export const CartBag = () => {
  const { setSidebarView, toggleSidebar } = useUI();
  const { data, isLoading } = useCart();
  const itemsCount = !isLoading
    ? data?.lineItems?.reduce(
        (count: number, item: currentCartV2.V2LineItem) =>
          count + (item.quantityInfo?.confirmedQuantity ?? 0),
        0
      )
    : 0;
  return (
    <button
      onClick={() => {
        setSidebarView('CART_VIEW');
        toggleSidebar();
      }}
      className="flex relative"
      aria-label={`Cart items: ${itemsCount}`}
    >
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        ></path>
      </svg>
      {itemsCount! > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-[#e9a23b] text-[#17231f] text-[11px] font-bold leading-none">
          {itemsCount}
        </span>
      )}
    </button>
  );
};
