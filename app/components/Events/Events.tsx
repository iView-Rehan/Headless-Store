'use client';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
import { getDatePart } from '@app/utils/date-formatter';
import { wixEventsV2 as wixEvents } from '@wix/events';
import { useState } from 'react';
import testIds from '@app/utils/test-ids';
import { Slider } from '@app/components/Slider/Slider';

export const Events = ({ events }: { events: wixEvents.Event[] }) => {
  const [expendEventDescription, setExpendEventDescription] = useState(
    {} as Record<string, boolean>
  );

  return (
    <div className="container-x" data-testid={testIds.TICKET_LIST.CONTAINER}>
      <Slider
        label="event"
        header={
          <>
            <h2 className="section-title">Upcoming events</h2>
            <p className="mt-3 opacity-75 max-w-md">
              Hosted evenings and workshops for small groups. Pick a date and
              book your place.
            </p>
          </>
        }
      >
        {events!.map((event) => {
          const start = new Date(event.dateAndTimeSettings?.startDate!);
          const tz = event.dateAndTimeSettings?.timeZoneId!;
          const open = !!expendEventDescription[event._id!];
          return (
            <li
              key={event._id}
              data-testid={testIds.TICKET_ITEM.CONTAINER}
              className="w-[82%] sm:w-[340px] shrink-0 snap-start"
            >
              <article className="h-full flex flex-col rounded-[10px] overflow-hidden bg-[#f5f6f1] text-[#17231f]">
                <div className="relative">
                  <WixMediaImage
                    media={event.mainImage}
                    width={680}
                    height={480}
                    alt={event.title ?? 'Event image'}
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-[#e9a23b] text-[#17231f] px-3 py-2 text-center leading-none">
                    <span className="block font-default text-2xl font-semibold">
                      {getDatePart(start, 'day', tz)}
                    </span>
                    <span className="block text-xs mt-1">
                      {getDatePart(start, 'month', tz)}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs opacity-60">
                    {getDatePart(start, 'weekday', tz)}
                    {event.location?.name ? `, ${event.location.name}` : ''}
                  </span>
                  <button
                    className="text-left mt-1 group/button font-default text-xl font-semibold leading-snug"
                    aria-expanded={open}
                    onClick={() =>
                      setExpendEventDescription({
                        [event._id!]: !expendEventDescription[event._id!],
                      })
                    }
                  >
                    {event.title}
                    <svg
                      fill="none"
                      className={`w-4 h-4 inline ml-2 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      ></path>
                    </svg>
                  </button>
                  {open ? (
                    <div className="text-sm mt-3 space-y-2 opacity-80">
                      <p>{event.dateAndTimeSettings?.formatted?.dateAndTime}</p>
                      <p>
                        {
                          // @ts-ignore
                          event.location?.address?.formatted
                        }
                      </p>
                      <p>{event.shortDescription}</p>
                    </div>
                  ) : null}
                  <div className="flex-1 min-h-[20px]" />
                  <a
                    data-testid={testIds.TICKET_ITEM.SELECT_CTA}
                    className="btn-main w-full"
                    href={`/events/${event.slug}`}
                  >
                    Book your place
                  </a>
                </div>
              </article>
            </li>
          );
        })}
      </Slider>
    </div>
  );
};
