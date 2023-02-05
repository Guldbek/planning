/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  fromBookingIntervals,
  checkIfDateExistsInIntervals,
} from '../helpers/intervalFromDates';
import type { ResourceType, StartIntervalType } from '.';
import { useMemo, useState } from 'react';
import Day from './_day';
import { useBooking } from '~/hooks/useBooking';
import { Interval } from 'luxon';

type PropsType = {
  weeks: any;
  dayWidth: number;
  resource: ResourceType;
};

export default function Resource(props: PropsType) {
  const { weeks, dayWidth, resource } = props;
  const [computedIntervals, setComputedIntervals] = useState<
    StartIntervalType[]
  >(resource.bookings);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [
    bookingEnabled,
    bookingInterval,
    onClickBookingStart,
    onHoverBooking,
    onClickBookingEnd,
  ] = useBooking(computedIntervals, setComputedIntervals);

  useMemo(() => {
    setIntervals(
      computedIntervals.map((booking) => fromBookingIntervals(booking)),
    );
  }, [computedIntervals]);

  return (
    <>
      <div className="flex flex-row hover:bg-zinc-100">
        <div className="w-1/5 border-r-4 border-b-2 p-2 text-right">
          {resource.name}
        </div>
        <div className="w-4/5 flex flex-row border-b-2">
          {weeks &&
            weeks.map((week, index) => (
              <div
                key={index}
                className="border-r-4"
                style={{ width: dayWidth * week.days.length + 'px' }}
              >
                <div className="flex flex-row">
                  {week.days.map((day, index) => (
                    <Day
                      key={`${resource.name}-resource-${day.weekNumber}${index}`}
                      onHoverBooking={onHoverBooking}
                      onClickBookingStart={onClickBookingStart}
                      onClickBookingEnd={onClickBookingEnd}
                      bookingEnabled={bookingEnabled}
                      dateTime={day}
                      index={index}
                      dayWidth={dayWidth}
                      color={'bg-cyan-400'}
                      isInInterval={
                        intervals &&
                        checkIfDateExistsInIntervals(intervals, day)
                      }
                      isInBookingInterval={bookingInterval?.contains(day)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
